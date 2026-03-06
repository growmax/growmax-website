import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { injectSSR } from "./ssr-utils";
import { storage } from "./storage";

export async function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const templatePath = path.resolve(distPath, "index.html");
  const template = fs.readFileSync(templatePath, "utf-8");

  let render: Function;
  try {
    const ssrPath = path.resolve(__dirname, "server", "entry-server.js");
    const ssrModule = await import(ssrPath);
    render = ssrModule.render;
  } catch (error) {
    console.error("Failed to load SSR bundle, falling back to SPA mode:", error);
    app.use(express.static(distPath));
    app.use("/{*path}", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
    return;
  }

  app.use(express.static(distPath, { index: false }));

  app.use("/{*path}", async (_req, res) => {
    const url = _req.originalUrl;

    try {
      const initialData = await prefetchData(url);
      const result = render(url, initialData);

      if (!result.html) {
        res.status(200).set({ "Content-Type": "text/html" }).send(template);
        return;
      }

      const page = injectSSR(template, result);
      res.status(200).set({ "Content-Type": "text/html" }).send(page);
    } catch (error) {
      console.error("SSR error, falling back to SPA:", error);
      res.status(200).set({ "Content-Type": "text/html" }).send(template);
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
    console.error("SSR prefetch error for", url, ":", error);
  }
  return undefined;
}
