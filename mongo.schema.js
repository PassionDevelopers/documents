// ========================================
// 뉴스 다양성 서비스 MongoDB 스키마 설계
// ========================================

// 1. ISSUES 컬렉션
// 주요 뉴스 이슈 정보 저장
db.createCollection("issues", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "title", "summary", "createdAt"],
      properties: {
        _id: {
          bsonType: "string",
          description: "이슈 ID"
        },
        title: {
          bsonType: "string",
          minLength: 1,
          maxLength: 200,
          description: "이슈 제목"
        },
        category: {
          enum: ["politics", "economy", "society", "culture", "international", "environment"],
          description: "이슈 카테고리"
        },
        summary: {
          bsonType: "string",
          minLength: 1,
          maxLength: 500,
          description: "이슈 요약"
        },
        imageUrl: {
          bsonType: "string",
          description: "이슈 관련 이미지 URL"
        },
        keywords: {
          bsonType: "array",
          items: {
            bsonType: "string",
            minLength: 1,
            maxLength: 50
          },
          description: "이슈 관련 키워드"
        },
        createdAt: {
          bsonType: "date",
          description: "생성 시간"
        },
        updatedAt: {
          bsonType: "date",
          description: "업데이트 시간"
        },
        // 상세 정보 (DetailedIssue용)
        leftSummary: {
          bsonType: "string",
          maxLength: 500,
          description: "좌성향 관점 요약"
        },
        centerSummary: {
          bsonType: "string",
          maxLength: 500,
          description: "중도 관점 요약"
        },
        rightSummary: {
          bsonType: "string",
          maxLength: 500,
          description: "우성향 관점 요약"
        },
        biasComparison: {
          bsonType: "string",
          maxLength: 500,
          description: "편향 비교 요약"
        },
        // 통계 정보 (캐시된 값들)
        view: {
          bsonType: "int",
          minimum: 0,
          description: "조회 수"
        },
        coverageSpectrum: {
          bsonType: "object",
          properties: {
            left: { bsonType: "int" },
            center: { bsonType: "int" },
            right: { bsonType: "int" },
            total: { bsonType: "int" }
          },
          description: "정치적 스펙트럼 분포"
        },
        leftKeywords: {
          bsonType: "array",
          items: {
            bsonType: "string",
            minLength: 1,
            maxLength: 50
          },
          description: "좌성향 키워드"
        },
        centerKeywords: {
          bsonType: "array",
          items: {
            bsonType: "string",
            minLength: 1,
            maxLength: 50
          },
          description: "중도 키워드"
        },
        rightKeywords: {
          bsonType: "array",
          items: {
            bsonType: "string",
            minLength: 1,
            maxLength: 50
          },
          description: "우성향 키워드"
        },
      },
      additionalProperties: false
    }
  }
});

// 2. ARTICLES 컬렉션
// 뉴스 기사 정보 + 미디어 소스 정보 임베딩
db.createCollection("articles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "title", "url", "source", "content", "preview"],
      properties: {
        _id: {
          bsonType: "string",
          description: "기사 ID"
        },
        preview: {
          bsonType: "string",
          minLength: 1,
          maxLength: 1000,
          description: "기사 프리뷰뷰"
        },
        title: {
          bsonType: "string",
          minLength: 1,
          maxLength: 300,
          description: "기사 제목"
        },
        summary: {
          bsonType: "string",
          maxLength: 500,
          description: "기사 요약"
        },
        keywords: {
          bsonType: "array",
          items: {
            bsonType: "string"
          }
        },
        content: {
          bsonType: "string",
          description: "기사 본문 내용"
        },
        url: {
          bsonType: "string",
          description: "기사 URL"
        },
        reporter: {
          bsonType: "string",
          minLength: 1,
          maxLength: 50,
          description: "기자 이름"
        },
        publishedAt: {
          bsonType: "date",
          description: "발행 시간"
        },
        issueId: {
          bsonType: "string",
          description: "관련 이슈 ID"
        },
        category: {
          enum: ["politics", "economy", "society", "culture", "international", "environment"],
          description: "기사 카테고리"
        },
        imageUrl: {
          bsonType: "string",
          description: "기사 이미지 URL"
        },
        // 미디어 소스 정보 임베딩 (읽기 최적화)
        sourceId: {
          bsonType: "string",
          additionalProperties: false,
          description: "미디어 소스 ID"
        },
        embedding: {
          bsonType: "array",
          items: {
            bsonType: "float64"
          },
          description: "기사 임베딩 벡터"
        },
      },
      additionalProperties: false
    }
  }
});

// 3. MEDIA_SOURCES 컬렉션
// 미디어 소스 마스터 데이터
db.createCollection("mediaSources", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "name", "perspective"],
      properties: {
        _id: {
          bsonType: "string",
          description: "미디어 소스 ID"
        },
        name: {
          bsonType: "string",
          minLength: 1,
          maxLength: 50,
          description: "미디어 소스 이름"
        },
        perspective: {
          enum: ["far_left", "left", "center_left", "center", "center_right", "right", "far_right"],
          description: "정치적 성향"
        },
        // 상세 정보
        description: {
          bsonType: "string",
          maxLength: 500,
          description: "미디어 소스 설명"
        },
        websiteUrl: {
          bsonType: "string",
          description: "웹사이트 URL"
        },
        foundedYear: {
          bsonType: "int",
          minimum: 1800,
          maximum: 2025,
          description: "설립 연도"
        },
        ownershipInfo: {
          bsonType: "string",
          maxLength: 200,
          description: "소유권 정보"
        },
        createdAt: {
          bsonType: "date",
          description: "등록 시간"
        }
      },
      additionalProperties: false
    }
  }
});

// ========================================
// 인덱스 설계
// ========================================

// ISSUES 컬렉션 인덱스
// 1. 기본 조회 패턴 최적화 (이슈 목록 조회가 가장 빈번)
db.issues.createIndex({ "category": 1, "createdAt": -1 });
db.issues.createIndex({ "createdAt": -1 }); // 최신순 정렬
db.issues.createIndex({ "updatedAt": -1 }); // 업데이트순 정렬

// 2. Atlas Search용 텍스트 인덱스 (또는 일반 텍스트 인덱스)
db.issues.createIndex({
  "title": "text",
  "summary": "text",
  "leftSummary": "text",
  "centerSummary": "text", 
  "rightSummary": "text"
}, {
  name: "issues_text_search",
  weights: {
    "title": 10,
    "summary": 5,
    "leftSummary": 1,
    "centerSummary": 1,
    "rightSummary": 1
  }
});

// ARTICLES 컬렉션 인덱스
// 1. 이슈별 기사 조회 최적화 (두 번째로 빈번한 패턴)
db.articles.createIndex({ "issueId": 1, "publishedAt": -1 });
db.articles.createIndex({ "issueId": 1, "perspective": 1, "publishedAt": -1 }); // 정치성향 필터용

// 2. 발행일자 기반 조회
db.articles.createIndex({ "publishedAt": -1 });

// 3. 미디어 소스별 조회
db.articles.createIndex({ "source._id": 1, "publishedAt": -1 });

// 4. 텍스트 검색용 인덱스
db.articles.createIndex({
  "title": "text",
  "summary": "text"
}, {
  name: "articles_text_search",
  weights: {
    "title": 10,
    "summary": 5
  }
});

// MEDIA_SOURCES 컬렉션 인덱스
// 1. 정치적 성향별 조회 (빈도 낮음)
db.mediaSources.createIndex({ "perspective": 1, "name": 1 });