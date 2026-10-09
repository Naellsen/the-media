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
      trending
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
      trending
    }
  }
}
`;

export const SEARCH_ANILIST_QUERY = `
  query ($search: String) {
    Page(page: 1, perPage: 20) {
      media(search: $search) {
        id
        title {
          romaji
          english
          native
        }
        type
        format
        coverImage {
          large
        }
        startDate {
          year
        }
        meanScore
        description
      }
    }
  }
`;

export const ANILIST_DETAIL_QUERY = `
  query ($id: Int, $type: MediaType) {
    Media(id: $id, type: $type) {
      id
      idMal
      title {
        romaji
        english
        native
      }
      type
      format
      status
      isAdult
      description(asHtml: false)
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      season
      seasonYear
      
      # Anime Specific
      episodes
      duration
      trailer {
        id
        site
        thumbnail
      }

      # Manga Specific
      chapters
      volumes

      countryOfOrigin
      source
      hashtag
      coverImage {
        extraLarge
        large
        color
      }
      bannerImage
      genres
      synonyms
      averageScore
      meanScore
      popularity
      favourites
      trending
      
      # Filter primary animation studio
      studios(isMain: true) {
        nodes {
          id
          name
          isAnimationStudio
        }
      }

      relations {
        edges {
          relationType
          node {
            id
            title {
              userPreferred
            }
            format
            type
            status
            coverImage {
              medium
            }
          }
        }
      }

      characters(sort: ROLE, perPage: 6) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              medium
            }
          }
          voiceActors(language: JAPANESE) {
            id
            name {
              full
            }
            image {
              medium
            }
            languageV2
          }
        }
      }

      staff(perPage: 6) {
      edges {
        role # Author, Art, Story & Art, etc.
        node {
          id
          name {
            full
          }
          image {
            medium
          }
        }
      }
    }

      recommendations(perPage: 6) {
        nodes {
          mediaRecommendation {
            id
            title {
              userPreferred
            }
            type
            format
            coverImage {
              medium
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_BY_GENRE_QUERY = `
  query ($genre: String, $type: MediaType) {
    Page(page: 1, perPage: 20) {
      media(genre: $genre, type: $type, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
        }
        type
        format
        episodes
        chapters
        meanScore
        coverImage {
          extraLarge
          large
        }
        description
      }
    }
  }
`;