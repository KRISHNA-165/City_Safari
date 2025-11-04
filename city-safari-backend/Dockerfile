# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom and download deps first (better layer caching)
COPY pom.xml .
RUN mvn -B -q -e -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -B -q -DskipTests package

# ---- Run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Render provides PORT; Spring reads it from application.properties
ENV PORT=8080
EXPOSE 8080

# Health-friendly JVM flags can be added via JAVA_OPTS env
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

