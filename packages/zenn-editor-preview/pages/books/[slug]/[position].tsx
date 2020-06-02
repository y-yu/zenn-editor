import Head from "next/head";
import { GetServerSideProps } from "next";

import markdownToHtml from "zenn-markdown-html";
import ContentBody from "@components/ContentBody";
import MainContainer from "@components/MainContainer";
import { getBookNavCollections } from "@utils/navCollections";
import { getChapter } from "@utils/api/chapters";

import { Chapter, NavCollections } from "@types";

type ChapterPageProps = {
  chapter: Chapter;
  bookNavCollections: NavCollections;
};

const ChapterPage = ({ chapter, bookNavCollections }: ChapterPageProps) => {
  return (
    <>
      <Head>
        <title>{chapter.title || "無題"}の編集</title>
      </Head>
      <MainContainer navCollections={bookNavCollections}>
        <article>
          <div>{chapter.title}</div>
        </article>
      </MainContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ChapterPageProps> = async ({
  res,
  params,
}) => {
  const paramsSlug = params.slug;
  const slug: string = Array.isArray(paramsSlug) ? paramsSlug[0] : paramsSlug;
  const paramsPosition = params.position;
  const position: string = Array.isArray(paramsPosition)
    ? paramsPosition[0]
    : paramsPosition;

  const bookNavCollections = getBookNavCollections(slug);

  const chapter = getChapter(slug, position, null);

  if (!chapter) {
    if (res) {
      res.writeHead(301, { Location: `/books/${slug}` });
      res.end();
      return;
    }
  }

  const content = markdownToHtml(chapter.content);

  return {
    props: {
      chapter: {
        ...chapter,
        content,
      },
      bookNavCollections,
    },
  };
};

export default ChapterPage;
