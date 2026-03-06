import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { injectSSR } from "./ssr-utils";
import { storage } from "./storage";

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("/{*path}", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/entry-client.tsx"`,
        `src="/src/entry-client.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);

      const { render } = (await vite.ssrLoadModule(
        "/src/entry-server.tsx",
      )) as { render: Function };

      const initialData = await prefetchData(url);
      const result = render(url, initialData);

      if (!result.html) {
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
        return;
      }

      const finalPage = injectSSR(page, result);
      res.status(200).set({ "Content-Type": "text/html" }).end(finalPage);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

async function prefetchData(
  url: string,
): Promise<Record<string, any> | undefined> {
  try {
    const cleanUrl = url.split("?")[0];

    if (cleanUrl === "/blog") {
      const posts = await storage.getPublishedBlogPosts();
      return { "/api/blog": posts };
    }

    const blogMatch = cleanUrl.match(/^\/blog\/(.+)$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const post = await storage.getBlogPostBySlug(slug);
      if (post) {
        return { [`/api/blog/${slug}`]: post };
      }
    }
  } catch (error) {
    console.error("SSR prefetch error:", error);
  }
  return undefined;
}
