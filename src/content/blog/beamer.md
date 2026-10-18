---
title: "Beamer Primary Usage"
description: "A brief introduction to the fundamental usage of Beamer."
date: 2024-01-20
tags: ["LaTeX"]
categories: ["tools"]
permalink: "tools/beamer"
---

## What is Beamer

Beamer is a LaTeX document class designed for **creating presentation slides**. It provides a set of features and styles to easily craft professional and visually appealing presentations using LaTeX syntax. Users can customize layouts, themes, colors, and incorporate elements like mathematical formulas, images, and tables. Beamer also supports animations and transitions, enhancing the interactivity and visual appeal of presentations. Overall, Beamer is a powerful tool for LaTeX users seeking high-quality typesetting and flexibility in creating presentations.

## How to use Beamer

In Beamer, a slide is composed of several **frame**s. Here, we will discuss how to use Beamer to create frames and some unique feature. In fact, Beamer supports almost all LaTeX syntax, so you can treat each frame as if it were an individual LaTeX document to edit. Therefore, we won’t focus on explaining how to populate the content of frames.

## Basic Document Structure

```latex
% For LaTex Font
\documentclass[fontset=none]{beamer}
\def\mathfamilydefault{\rmdefault}

% Chinese support
\usepackage{ctex}

% Figure settings
\usepackage{caption}
\graphicspath{{assets/}}% Add image path
\setbeamertemplate{caption}[numbered]% Number figures
\captionsetup[figure]{name=Fig.}% When package "ctex" is used, but you perfer "Fig. x：" than "图x: "

% Choose a theme
\usetheme{default}
\usecolortheme{whale}

% Information for title page
\title{sample title}
\author{sample name}
\institute{sample institute}
\date{January 01, 1970}

\begin{document}

\frame{\titlepage}

% Body text
\section{title1}

\subsection{subtitle1}
\begin{frame}
  \frametitle{title1}
  \framesubtitle{subtitle1}
  % Content for the motivation frame
\end{frame}

\subsection{subtitle2}
\begin{frame}
  \frametitle{title1}
  \framesubtitle{subtitle2}
  % Content for the method frame
\end{frame}

\end{document}
```

You can refer to **[this website](https://mpetroff.net/files/beamer-theme-matrix/)** for theme and color theme previews.

## Potentially useful code snippets

End page

```latex
\begin{frame}{}
  \centering \Large
  \emph{END}
\end{frame}
```

Table of contents

```latex
\begin{frame} % [shrink] is optional when the contents is too long
  \addtocounter{framenumber}{-2} % Adjust page numbering
  \frametitle{Contents}
  \thispagestyle{empty}
  \tableofcontents % [pausesections] is optional when this frame only serves as a section's table of contents
\end{frame}
```

Figures

```latex
\begin{figure}
  \centering
  \includegraphics[width=0.5\textwidth]{file path/file name}
  \caption{description}
  \label{quote tag}
\end{figure}
```

Unordered lists

```latex
\begin{itemize}
\item item1
\item item2
\end{itemize}
```

Ordered lists

```latex
\begin{enumerate}
\item item1
\item item2
\end{enumerate}
```
