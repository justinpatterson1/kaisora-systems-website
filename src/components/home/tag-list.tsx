/**
 * Technology tags. A `<ul>` so assistive tech announces the count. Shared by
 * the homepage work section and the case-study pages, so a project's stack
 * looks the same in both places.
 */
export function TagList({ tags }: { tags: readonly string[] }) {
  return (
    <ul className="tags" aria-label="Built with">
      {tags.map((tag) => (
        <li key={tag} className="tag">
          {tag}
        </li>
      ))}
    </ul>
  );
}
