CREATE TABLE "SiteContent" (
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "LegalDocument" (
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LegalDocument_pkey" PRIMARY KEY ("slug")
);

CREATE INDEX "SiteContent_updatedAt_idx" ON "SiteContent"("updatedAt");
CREATE INDEX "LegalDocument_isActive_idx" ON "LegalDocument"("isActive");
CREATE INDEX "LegalDocument_updatedAt_idx" ON "LegalDocument"("updatedAt");
