from datetime import datetime
from typing import List, Optional, Annotated
from pydantic import BaseModel, Field
from enum import Enum


class CategoryEnum(str, Enum):
    """기사/이슈 카테고리"""
    politics = "politics"
    economy = "economy"
    society = "society"
    culture = "culture"
    international = "international"
    environment = "environment"


class PerspectiveEnum(str, Enum):
    """미디어 소스의 정치적 성향"""
    left = "left"
    center_left = "center_left"
    center = "center"
    center_right = "center_right"
    right = "right"


class CoverageSpectrum(BaseModel):
    """정치적 스펙트럼 분포"""
    left: int = Field(ge=0)
    center: int = Field(ge=0)
    right: int = Field(ge=0)
    total: int = Field(ge=0)


class CategoryInfo(BaseModel):
    """미디어 소스의 카테고리 정보"""
    name: str = Field(..., min_length=1, max_length=50)
    url: str = Field(..., max_length=500)


# 키워드 타입 정의 (재사용을 위해)
Keyword = Annotated[str, Field(min_length=1, max_length=50)]


class Issue(BaseModel):
    """이슈 컬렉션 모델"""
    id: str = Field(..., alias="_id", description="이슈 ID")
    title: str = Field(..., min_length=1, max_length=200, description="이슈 제목")
    category: Optional[CategoryEnum] = Field(None, description="이슈 카테고리")
    summary: str = Field(..., min_length=1, max_length=500, description="이슈 요약")
    image_url: Optional[str] = Field(None, alias="imageUrl", description="이슈 관련 이미지 URL")
    keywords: Optional[List[Keyword]] = Field(None, description="이슈 관련 키워드")
    created_at: datetime = Field(..., alias="createdAt", description="생성 시간")
    updated_at: Optional[datetime] = Field(None, alias="updatedAt", description="업데이트 시간")
    
    # 상세 정보 (DetailedIssue용)
    left_summary: Optional[str] = Field(
        None, 
        alias="leftSummary", 
        max_length=500, 
        description="좌성향 관점 요약"
    )
    center_summary: Optional[str] = Field(
        None, 
        alias="centerSummary", 
        max_length=500, 
        description="중도 관점 요약"
    )
    right_summary: Optional[str] = Field(
        None, 
        alias="rightSummary", 
        max_length=500, 
        description="우성향 관점 요약"
    )
    bias_comparison: Optional[str] = Field(
        None, 
        alias="biasComparison", 
        max_length=500, 
        description="편향 비교 요약"
    )
    
    # 통계 정보
    view: Optional[int] = Field(None, ge=0, description="조회 수")
    coverage_spectrum: Optional[CoverageSpectrum] = Field(
        None, 
        alias="coverageSpectrum", 
        description="정치적 스펙트럼 분포"
    )
    left_keywords: Optional[List[Keyword]] = Field(
        None, 
        alias="leftKeywords", 
        description="좌성향 키워드"
    )
    center_keywords: Optional[List[Keyword]] = Field(
        None, 
        alias="centerKeywords", 
        description="중도 키워드"
    )
    right_keywords: Optional[List[Keyword]] = Field(
        None, 
        alias="rightKeywords", 
        description="우성향 키워드"
    )

    model_config = {
        "populate_by_name": True,  # 원래 필드명도 허용
        "by_alias": True          # JSON 출력 시 alias 사용
    }


class Article(BaseModel):
    """기사 컬렉션 모델"""
    id: str = Field(..., alias="_id", description="기사 ID")
    preview: Optional[str] = Field(
        None, 
        min_length=1, 
        max_length=1000, 
        description="기사 프리뷰"
    )
    title: str = Field(..., min_length=1, max_length=300, description="기사 제목")
    keywords: Optional[List[Keyword]] = Field(None, description="기사 키워드")
    content: str = Field(..., description="기사 본문 내용")
    url: str = Field(..., description="기사 URL")
    reporter: Optional[str] = Field(
        None, 
        min_length=1, 
        max_length=50, 
        description="기자 이름"
    )
    published_at: Optional[str] = Field(None, alias="publishedAt", description="발행 시간")
    issue_id: Optional[str] = Field(None, alias="issueId", description="관련 이슈 ID")
    category: Optional[CategoryEnum] = Field(None, description="기사 카테고리")
    image_url: Optional[str] = Field(None, alias="imageUrl", description="기사 이미지 URL")
    
    # 미디어 소스 정보
    source_id: Optional[str] = Field(None, alias="sourceId", description="미디어 소스 ID")
    
    # 임베딩 벡터
    embedding: Optional[List[float]] = Field(None, description="기사 임베딩 벡터")

    model_config = {
        "populate_by_name": True,  # 원래 필드명도 허용
        "by_alias": True          # JSON 출력 시 alias 사용
    }


class MediaSource(BaseModel):
    """미디어 소스 컬렉션 모델"""
    id: str = Field(..., alias="_id", description="미디어 소스 ID")
    name: str = Field(..., min_length=1, max_length=50, description="미디어 소스 이름")
    perspective: PerspectiveEnum = Field(..., description="정치적 성향")
    
    # 상세 정보
    description: Optional[str] = Field(None, max_length=500, description="미디어 소스 설명")
    website_url: Optional[str] = Field(None, alias="websiteUrl", description="웹사이트 URL")
    founded_year: Optional[int] = Field(
        None, 
        alias="foundedYear", 
        ge=1800, 
        le=2026, 
        description="설립 연도"
    )
    ownership_info: Optional[str] = Field(
        None, 
        alias="ownershipInfo", 
        max_length=200, 
        description="소유권 정보"
    )
    created_at: Optional[datetime] = Field(None, alias="createdAt", description="등록 시간")
    category_list: Optional[List[CategoryInfo]] = Field(
        None, 
        alias="category_list", 
        description="카테고리 목록"
    )

    model_config = {
        "populate_by_name": True,  # 원래 필드명도 허용
        "by_alias": True          # JSON 출력 시 alias 사용
    }
