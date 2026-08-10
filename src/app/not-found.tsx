/* eslint-disable @next/next/no-html-link-for-pages -- preserve canonical trailing-slash public paths in the 404 response */
export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-nav-theme">Page not found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The page you requested is not part of the published Corsair Cove guide library.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        {/* Canonical public paths intentionally retain their trailing-slash form. */}
        <a className="rounded-md bg-cta px-5 py-3 font-semibold text-foreground hover:brightness-110" href="/">Back to home</a>
        <a className="rounded-md border border-border px-5 py-3 font-semibold text-nav-theme hover:bg-background" href="/guides/">Browse guides</a>
      </div>
    </main>
  )
}
