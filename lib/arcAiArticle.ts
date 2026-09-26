import type { BlogPost, InsertBlogPost } from './schema'

export const ARC_AI_ARTICLE_SLUG = 'claude-commerce-agents-b2b'

export const arcAiArticle: InsertBlogPost = {
  slug: ARC_AI_ARTICLE_SLUG,
  title: 'What Claude Commerce Agents asks the merchant to build, and what that means for B2B',
  category: 'AI Insights',
  date: 'Sep 5, 2026',
  author: 'Growmax Team',
  authorTeam: 'Growmax AI Team',
  readTime: '8 Min Read',
  excerpt: 'Anthropic’s open-source Claude Commerce Agents blueprint defines the agent experience clearly. The merchant still owns the backend, business rules, authorization, and safe writes—and B2B makes those responsibilities deeper.',
  published: true,
  relatedSlugs: [],
  sections: [
    {
      heading: 'A blueprint for the agent experience',
      headingId: 'blueprint-agent-experience',
      content: `<p>Anthropic’s open-source <a href="https://github.com/anthropics/commerce-agents" target="_blank" rel="noopener noreferrer">Claude Commerce Agents</a> project is a reference implementation for two sides of commerce: a shopping agent that helps a buyer discover and purchase, and a merchant agent that helps an operator manage the store. It describes staged approvals and a set of skills for each agent.</p><p>That is useful because it makes the interaction model concrete. It also draws a clear boundary: the merchant deploying the blueprint supplies the <strong>StorefrontBackend</strong> and <strong>MerchantBackend</strong>. The repository does not replace the merchant’s systems of record, authorization model, commercial rules, or compliance controls.</p><p>That boundary is where the B2B implementation work begins.</p>`,
    },
    {
      heading: 'The merchant backend is where commerce becomes real',
      headingId: 'merchant-backend-commerce',
      content: `<p>An agent can ask for a catalog result, a cart, an order status, a policy answer, or a listing change. The backend has to decide what data is current, who may see it, what action is allowed, and whether a proposed write can be applied.</p><p>For a consumer storefront, those decisions may center on one price, one cart, and immediate payment. A B2B seller often needs account-specific catalogs, per-pack pricing, quantity ladders, negotiated terms, credit limits, quote versions, approval thresholds, purchase orders, branch access, and stock across warehouses.</p><p>The agent should not invent those rules. It should call a backend that already owns them.</p>`,
    },
    {
      heading: 'What changes for B2B',
      headingId: 'what-changes-for-b2b',
      content: `<p>B2B buying is a sequence of governed states rather than a single checkout moment. A request can move from cart to quote, from quote to approval, and from approved quote to order and invoice. The buyer may be acting for a named account, while a sales representative, dealer, or branch manager has a different view of the same transaction.</p><p>That makes role scope and money especially important. The agent should see only what the connected user can see. Prices, totals, credit terms, and approval requirements should come from the commerce engine—not from model arithmetic. A safe implementation separates reading, proposing, approving, and applying so that one approval authorizes exactly one write.</p><p>Growmax ARC provides this operational B2B layer. The detailed, neutral responsibility map is available on our <a href="/arc/ai/claude-commerce-agents">Claude Commerce Agents and B2B mapping page</a>.</p>`,
    },
    {
      heading: 'External agents and the in-product assistant are different surfaces',
      headingId: 'connection-surfaces',
      content: `<p>ARC’s MCP agent surface is generally available. Compatible clients—including Claude.ai, ChatGPT, Claude Code, Cursor, and Claude Desktop—can connect through OAuth 2.1, subject to the permissions of the ARC user who authorizes the connection.</p><p>Growmax Minori (private beta) is the in-product assistant experience. It uses the same principle of visible, reviewable work: a change is proposed as a card, approved deliberately, applied as a governed write, and presented with an undo path where the operation supports reversal.</p><p>The availability distinction matters. MCP connectivity is an available integration surface; Growmax Minori remains a private beta evaluated with selected teams.</p>`,
    },
    {
      heading: 'A practical way to evaluate an agent-ready backend',
      headingId: 'evaluate-agent-ready-backend',
      content: `<p>Start with a real workflow and follow the boundaries. Can the agent retrieve account-correct catalog and pricing context? Can it explain why an action is unavailable? Does it preserve a proposal when a write fails? Can access be revoked without changing commerce records? Are applied changes traceable and reversible where appropriate?</p><p>The right test is not whether an assistant can produce a confident sentence. It is whether the commerce backend keeps permissions, prices, approvals, and writes correct across the whole task.</p><p>Explore the <a href="/arc/ai">Growmax ARC AI hub</a>, review the <a href="/arc/ai/connect">connection guide</a>, or <a href="/demo?source=arc-ai-hub">book a demo</a> to map these controls to your B2B workflow.</p>`,
    },
  ],
}

const publishedAt = new Date('2026-09-05T00:00:00.000Z')

export const arcAiArticleFallback: BlogPost = {
  id: -1,
  slug: arcAiArticle.slug,
  title: arcAiArticle.title,
  category: arcAiArticle.category,
  date: arcAiArticle.date,
  author: arcAiArticle.author,
  authorTeam: arcAiArticle.authorTeam ?? 'Growmax AI Team',
  readTime: arcAiArticle.readTime ?? '8 Min Read',
  excerpt: arcAiArticle.excerpt,
  sections: arcAiArticle.sections ?? [],
  relatedSlugs: arcAiArticle.relatedSlugs ?? [],
  published: true,
  legacyUrl: null,
  createdAt: publishedAt,
  updatedAt: publishedAt,
}