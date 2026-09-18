// src/app/query/query.js

export const TOP_MEDIA_QUERY = `
query GetTopMedia($page: Int = 1, $perPage: Int = 10, $sort: [MediaSort] = [SCORE_DESC]) {
  anime: Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: $sort) {
      id
      title { 
        romaji 
        english 
      }
      coverImage { 
        extraLarge 
        large 
      }
      meanScore
      episodes
      format
      description
    }
  }
  manga: Page(page: $page, perPage: $perPage) {
    media(type: MANGA, sort: $sort) {
      id
      title { 
        romaji 
        english 
      }
      coverImage { 
        extraLarge 
        large 
      }
      meanScore
      chapters
      volumes
      format
      description
    }
  }
}
`;