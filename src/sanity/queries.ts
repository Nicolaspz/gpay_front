import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    subtitle,
    excerpt,
    category,
    author,
    authorRole,
    publishedAt,
    "cover": cover.asset->url,
    "avatar": avatar.asset->url
  }`
);

export const POST_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    subtitle,
    excerpt,
    category,
    author,
    authorRole,
    publishedAt,
    "cover": cover.asset->url,
    "avatar": avatar.asset->url,
    body
  }`
);
