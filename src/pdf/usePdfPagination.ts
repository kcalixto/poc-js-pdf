import { useLayoutEffect, useRef, useState } from "react";
import type { ContentBrick } from "./bricks";
import { AVAILABLE_HEIGHT_PX, HEADER_HEIGHT_PX } from "./constants";

/**
 * Measures each brick's rendered height and greedily packs them into pages.
 *
 * The first page reserves HEADER_HEIGHT_PX for the header block.
 * Section-spacer bricks that land at the top of a continuation page are
 * stripped so pages don't start with blank space.
 *
 * Returns:
 * - measureRef: attach to the hidden measurement container
 * - pages: array of pages, each containing the bricks that fit on that page
 */
export function usePdfPagination(bricks: ContentBrick[]) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<ContentBrick[][]>([]);

  useLayoutEffect(() => {
    if (!measureRef.current) return;

    const elements = Array.from(measureRef.current.children) as HTMLElement[];

    // offsetHeight excludes CSS bottom margins due to margin collapse, which
    // causes the algorithm to underestimate heights and overflow the page.
    // Instead, measure the distance from each element's top to the next
    // element's top — this captures the full visual slot including any gap.
    const heights = elements.map((el, i) => {
      if (i < elements.length - 1) {
        const thisTop = el.getBoundingClientRect().top;
        const nextTop = elements[i + 1].getBoundingClientRect().top;
        return nextTop - thisTop;
      }
      return el.getBoundingClientRect().height;
    });

    const rawPages: ContentBrick[][] = [[]];
    let usedHeight = HEADER_HEIGHT_PX;

    bricks.forEach((brick, index) => {
      const height = heights[index];

      if (usedHeight + height > AVAILABLE_HEIGHT_PX) {
        rawPages.push([brick]);
        usedHeight = height;
      } else {
        rawPages[rawPages.length - 1].push(brick);
        usedHeight += height;
      }
    });

    // Strip leading spacers from every page so continuation pages don't open
    // with blank space when a spacer happened to fall right at a page boundary.
    const cleanPages = rawPages
      .map((page) => {
        const firstContent = page.findIndex((b) => b.kind !== "section-spacer");
        return firstContent === -1 ? [] : page.slice(firstContent);
      })
      .filter((page) => page.length > 0);

    setPages(cleanPages);
  }, [bricks]);

  return { measureRef, pages };
}
