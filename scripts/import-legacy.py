#!/usr/bin/env python3
"""Convert a Hugo/PaperMod `public/` tree into Markdown for this Astro site.

Usage:
    python3 scripts/import-legacy.py <clone-of-add2333.github.io> src/content/blog

It walks every `.../<slug>/index.html` that contains a `post-content` block and
writes `<slug>.md` next to a generated front matter block. The output is a
starting point: code fences, lists and links survive, but skim the result and
fix dates, tags and categories by hand.
"""

from __future__ import annotations

import html
import pathlib
import re
import sys
from html.parser import HTMLParser


def content_div(source: str) -> str:
    start = source.index('<div class="post-content">')
    start += len('<div class="post-content">')
    depth = 1
    for match in re.finditer(r"<div\b|</div>", source[start:]):
        depth += 1 if match.group(0) != "</div>" else -1
        if depth == 0:
            return source[start : start + match.start()]
    raise ValueError("unbalanced post-content div")


class Markdown(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []
        self.pre: dict | None = None
        self.skip_depth = 0
        self.list_stack: list[str] = []
        self.link: str | None = None

    def emit(self, text: str) -> None:
        self.out.append(text)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        classes = attributes.get("class", "")

        if tag == "a" and "anchor" in classes:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return
        if tag == "pre":
            self.pre = {"lang": "", "text": []}
            return
        if self.pre is not None:
            if tag == "code":
                match = re.search(r"language-([\w+-]+)", classes)
                if match:
                    self.pre["lang"] = match.group(1)
            return

        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self.emit("\n" + "#" * int(tag[1]) + " ")
        elif tag == "p":
            self.emit("\n\n")
        elif tag in {"ul", "ol"}:
            self.list_stack.append(tag)
        elif tag == "li":
            indent = "  " * max(0, len(self.list_stack) - 1)
            bullet = "1." if self.list_stack and self.list_stack[-1] == "ol" else "-"
            self.emit(f"\n{indent}{bullet} ")
        elif tag in {"strong", "b"}:
            self.emit("**")
        elif tag in {"em", "i"}:
            self.emit("*")
        elif tag == "code":
            self.emit("`")
        elif tag == "br":
            self.emit("\n")
        elif tag == "blockquote":
            self.emit("\n\n> ")
        elif tag == "hr":
            self.emit("\n\n---\n\n")
        elif tag == "a":
            self.link = attributes.get("href", "")

    def handle_endtag(self, tag):
        if tag == "pre" and self.pre is not None:
            body = "".join(self.pre["text"]).rstrip("\n")
            self.emit(f"\n\n```{self.pre['lang']}\n{body}\n```\n\n")
            self.pre = None
            return
        if self.skip_depth:
            if tag == "a":
                self.skip_depth -= 1
            return
        if self.pre is not None:
            return
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self.emit("\n")
        elif tag in {"ul", "ol"}:
            if self.list_stack:
                self.list_stack.pop()
            self.emit("\n")
        elif tag in {"strong", "b"}:
            self.emit("**")
        elif tag in {"em", "i"}:
            self.emit("*")
        elif tag == "code":
            self.emit("`")
        elif tag == "a":
            self.link = None

    def handle_data(self, data):
        if self.skip_depth:
            return
        if self.pre is not None:
            self.pre["text"].append(data)
            return
        if self.link is not None:
            if self.link.startswith("#"):
                self.emit(data)
            else:
                self.emit(f"[{data}]({self.link})")
            return
        self.emit(data)


def convert(page: pathlib.Path) -> tuple[str, str]:
    source = page.read_text(encoding="utf-8")
    parser = Markdown()
    parser.feed(content_div(source))
    body = "".join(parser.out)
    body = re.sub(r"\n\n(?=[ \t]*(?:[-*+]|\d+\.)\s)", "\n", body)
    body = re.sub(r"[ \t]+\n", "\n", body)
    body = re.sub(r"\n{3,}", "\n\n", body).strip()

    title_match = re.search(r'<h1 class="post-title">\s*(.*?)\s*</h1>', source, re.S)
    description_match = re.search(
        r'<div class="post-description">\s*(.*?)\s*</div>', source, re.S
    )
    permalink_match = re.search(r'<link rel="canonical" href="[^"]*?/([^"]*)/">', source)

    title = html.unescape(title_match.group(1)) if title_match else page.parent.name
    description = (
        html.unescape(description_match.group(1)) if description_match else ""
    )
    permalink = permalink_match.group(1) if permalink_match else page.parent.name

    markdown = "\n".join(
        [
            "---",
            f'title: "{title}"',
            f'description: "{description}"',
            "date: 2024-01-01",
            "tags: []",
            "categories: []",
            f'permalink: "{permalink}"',
            "---",
            "",
            body,
            "",
        ]
    )
    return title, markdown


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 1
    source_root = pathlib.Path(sys.argv[1])
    target_root = pathlib.Path(sys.argv[2])
    target_root.mkdir(parents=True, exist_ok=True)
    found = 0
    for page in sorted(source_root.rglob("index.html")):
        if "post-content" not in page.read_text(encoding="utf-8"):
            continue
        title, markdown = convert(page)
        target = target_root / f"{page.parent.name}.md"
        target.write_text(markdown, encoding="utf-8")
        found += 1
        print(f"wrote {target}  ({title})")
    print(f"{found} post(s) converted")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
