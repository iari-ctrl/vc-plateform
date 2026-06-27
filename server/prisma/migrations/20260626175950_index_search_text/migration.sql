-- CreateIndex
CREATE INDEX "BlogPost_searchText_idx" ON "BlogPost"("searchText");

-- CreateIndex
CREATE INDEX "CaseStudy_searchText_idx" ON "CaseStudy"("searchText");

-- CreateIndex
CREATE INDEX "Course_searchText_idx" ON "Course"("searchText");

-- CreateIndex
CREATE INDEX "GlossaryTerm_searchText_idx" ON "GlossaryTerm"("searchText");

-- CreateIndex
CREATE INDEX "LearningPath_searchText_idx" ON "LearningPath"("searchText");

-- CreateIndex
CREATE INDEX "Lesson_searchText_idx" ON "Lesson"("searchText");

-- CreateIndex
CREATE INDEX "Simulator_searchText_idx" ON "Simulator"("searchText");
