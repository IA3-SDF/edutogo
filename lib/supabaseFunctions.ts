import {
    Asset,
    Chapter,
    Course,
    CourseSection,
    DatabaseState,
    Evaluation,
    Exercise,
    FavoriteRow,
    Level,
    QuizQuestion,
    Subject,
    UserFavorite,
    UserNotification,
    UserProfile,
} from "../types";
import { getSupabaseClient } from "./supabase";

function requireSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error(
      "[EduTogo] Supabase n'est pas configuré. Vérifie NEXT_PUBLIC_SUPABASE_URL et " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY dans ton fichier .env.local, puis relance le serveur de dev.",
    );
  }
  return supabase;
}

/** Convertit un id frontend (string) en number pour les tables à id "serial". */
function parseId(id: any): number | undefined {
  if (id === undefined || id === null || id === "") return undefined;
  const num = Number(id);
  return isNaN(num) ? undefined : num;
}

const emptyDatabaseState: DatabaseState = {
  levels: [],
  subjects: [],
  chapters: [],
  courses: [],
  exercises: [],
  quizzes: [],
  evaluations: [],
};

/**
 * Récupère l'intégralité de l'état de l'application depuis Supabase.
 * Aucun fallback "mock" : si Supabase n'est pas joignable, on retourne
 * un état vide (et on logue l'erreur en console pour debug).
 */
export async function fetchDatabaseState(): Promise<DatabaseState> {
  const supabase = requireSupabase();
  if (!supabase) return emptyDatabaseState;

  try {
    // 1. Levels
    const { data: levelsData, error: levelsErr } = await supabase
      .from("levels")
      .select("*")
      .order("order");
    if (levelsErr) throw levelsErr;

    // 2. Subjects
    const { data: subjectsData, error: subjectsErr } = await supabase
      .from("subjects")
      .select("*");
    if (subjectsErr) throw subjectsErr;

    // 3. Chapters
    const { data: chaptersData, error: chaptersErr } = await supabase
      .from("chapters")
      .select("*")
      .order("number");
    if (chaptersErr) throw chaptersErr;

    // 4. Courses + sections
    const { data: coursesData, error: coursesErr } = await supabase
      .from("courses")
      .select("*");
    if (coursesErr) throw coursesErr;

    const { data: sectionsData, error: sectionsErr } = await supabase
      .from("course_sections")
      .select("*")
      .order("order_num");
    if (sectionsErr) throw sectionsErr;

    const { data: mediaData, error: mediaErr } = await supabase
      .from("media")
      .select("*");
    if (mediaErr) throw mediaErr;

    // 5. Exercises
    const { data: exercisesData, error: exercisesErr } = await supabase
      .from("exercises")
      .select("*");
    if (exercisesErr) throw exercisesErr;

    // 6. Quizzes — try new grouped model first (quiz_groups + quiz_questions)
    const { data: quizGroupsData, error: quizGroupsErr } = await supabase
      .from("quiz_groups")
      .select("*");

    let quizzesData: any[] = [];
    let quizGroupsFull: any[] | null = null;

    if (!quizGroupsErr && quizGroupsData && (quizGroupsData as any[]).length > 0) {
      // grouped model exists — load questions and attach
      quizGroupsFull = quizGroupsData as any[];
      const groupIds = (quizGroupsFull || []).map((g: any) => g.id);
      const { data: quizQuestionsData, error: quizQuestionsErr } = await supabase
        .from("quiz_questions")
        .select("*")
        .in("quiz_group_id", groupIds)
        .order("order_num");
      if (quizQuestionsErr) throw quizQuestionsErr;

      // Flatten questions into quizzesData for backwards compatibility
      quizzesData = (quizQuestionsData || []).map((q: any) => {
        const parent = quizGroupsFull!.find((g: any) => String(g.id) === String(q.quiz_group_id));
        return {
          id: q.id,
          chapter_id: parent ? parent.chapter_id : q.chapter_id,
          quiz_group_id: q.quiz_group_id,
          question: q.question,
          options: q.options,
          correct_index_val: q.correct_index_val,
          explanation: q.explanation,
        };
      });

      const quizQuestions = quizQuestionsData || [];

      // Attach questions to quiz groups so new UI can render group metadata.
      quizGroupsFull = (quizGroupsFull || []).map((group: any) => ({
        id: String(group.id),
        chapterId: group.chapter_id,
        title: group.title,
        createdAt: group.created_at,
        questions: quizQuestions
          .filter((q: any) => String(q.quiz_group_id) === String(group.id))
          .map((q: any) => ({
            id: String(q.id),
            chapterId: String(group.chapter_id),
            quizGroupId: String(q.quiz_group_id),
            question: q.question,
            options: q.options || [],
            correctIndex: q.correct_index_val ?? 0,
            explanation: q.explanation || "",
          })),
      }));
    } else {
      // Fallback: legacy flat table `quizzes`
      const { data: quizzesLegacyData, error: quizzesErr } = await supabase
        .from("quizzes")
        .select("*");
      if (quizzesErr) throw quizzesErr;
      quizzesData = quizzesLegacyData || [];
    }

    // 7. Evaluations
    const { data: evaluationsData, error: evaluationsErr } = await supabase
      .from("evaluations")
      .select("*");
    if (evaluationsErr) throw evaluationsErr;

    const dbState: DatabaseState = {
      levels: (levelsData || []).map((lvl: any) => ({
        id: lvl.id,
        name: lvl.name,
        description: lvl.description || "",
      })),
      subjects: (subjectsData || []).map((sbj: any) => ({
        id: sbj.id,
        levelId: sbj.level_id,
        name: sbj.name,
        icon: sbj.icon || "BookOpen",
        color: sbj.color || "blue",
        progress: sbj.progress || 0,
      })),
      chapters: (chaptersData || []).map((chp: any) => {
        const relatedAssets = (mediaData || [])
          .filter((asset: any) => String(asset.chapter_id) === String(chp.id))
          .map((asset: any) => ({
            id: asset.external_id || `asset-${asset.id}`,
            name: asset.name,
            type: asset.type,
            url: asset.url,
            size: asset.size || undefined,
            createdAt: asset.created_at,
            storagePath: asset.storage_path || undefined,
          }));

        return {
          id: chp.id,
          subjectId: chp.subject_id,
          levelId: chp.level_id,
          number: chp.number,
          title: chp.title,
          description: chp.description || "",
          isCompleted: chp.is_completed,
          isLocked: chp.is_locked,
          assets: relatedAssets.length > 0 ? relatedAssets : undefined,
        };
      }),
      courses: (coursesData || []).map((crs: any) => {
        const relatedSections = (sectionsData || [])
          .filter((sec: any) => String(sec.course_id) === String(crs.id))
          .map((sec: any) => ({
            id: String(sec.id),
            title: sec.title,
            content: sec.content || "",
            order: sec.order_num,
          }));
        return {
          id: String(crs.id),
          chapterId: crs.chapter_id,
          title: crs.title,
          content: crs.content || "",
          createdAt: crs.created_at,
          sections: relatedSections,
        };
      }),
      exercises: (exercisesData || []).map((ex: any) => ({
        id: String(ex.id),
        chapterId: ex.chapter_id,
        number: String(ex.number),
        title: ex.title,
        question: ex.question || "",
        hint: ex.hint || "",
        solution: ex.solution || "",
        category: ex.category as "activité" | "exercice",
      })),
      quizzes: (quizzesData || []).map((qz: any) => ({
        id: String(qz.id),
        chapterId: qz.chapter_id,
        question: qz.question,
        options: qz.options || [],
        correctIndex: qz.correct_index_val ?? 0,
        explanation: qz.explanation || "",
      })),
      // If we loaded the grouped model, expose it for newer UI components
      quizGroups: (typeof quizGroupsFull !== "undefined" && quizGroupsFull && quizGroupsFull.length > 0)
        ? (quizGroupsFull || []).map((g: any) => ({
            id: String(g.id),
            chapterId: g.chapter_id,
            title: g.title,
            createdAt: g.created_at,
            questions: g.questions || [],
          }))
        : undefined,
      evaluations: (evaluationsData || []).map((ev: any) => ({
        id: String(ev.id),
        levelId: ev.level_id,
        subjectId: ev.subject_id,
        title: ev.title,
        type: ev.type as "DS" | "Annale",
        year: ev.year ? String(ev.year) : undefined,
        hasSubject: ev.has_subject,
        hasSolution: ev.has_solution,
        subjectUrl: ev.subject_url || undefined,
        solutionUrl: ev.solution_url || undefined,
      })),
    };

    return dbState;
  } catch (error) {
    console.error("[EduTogo] Erreur lors du chargement de l'état depuis Supabase :", error);
    return emptyDatabaseState;
  }
}

/**
 * Synchronise le profil utilisateur vers Supabase.
 */
export async function syncUserProfile(
  user: UserProfile,
  userId: string,
): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  try {
    // Ensure avatar path always includes bucket prefix for consistent storage
    let avatarUrl = user.avatarUrl || null;
    if (avatarUrl && !avatarUrl.startsWith("avatars/")) {
      avatarUrl = `avatars/${avatarUrl}`;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: user.fullName,
      role: user.role,
      class_level: user.classLevel,
      email: user.email,
      avatar_url: avatarUrl,
      preferences_notifications: user.preferences.notifications,
      preferences_offline_mode: user.preferences.offlineMode,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("[EduTogo] Erreur lors de la synchronisation du profil :", err);
    return false;
  }
}

/**
 * Récupère le profil d'un utilisateur depuis Supabase.
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = requireSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Ensure avatar paths always have the bucket prefix for consistent detection
    let avatarUrl = data.avatar_url || undefined;
    if (avatarUrl && !avatarUrl.startsWith("avatars/")) {
      avatarUrl = `avatars/${avatarUrl}`;
    }

    return {
      id: data.id,
      fullName: data.full_name,
      role: data.role as "student" | "admin",
      classLevel: data.class_level,
      email: data.email,
      avatarUrl,
      preferences: {
        notifications: data.preferences_notifications,
        offlineMode: data.preferences_offline_mode,
      },
    };
  } catch (err) {
    console.error("[EduTogo] Erreur lors du chargement du profil :", err);
    return null;
  }
}

export async function fetchUserNotifications(userId: string): Promise<UserNotification[]> {
  const supabase = requireSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return (data || []).map((item: any) => ({
      id: Number(item.id),
      userId: item.user_id,
      title: item.title,
      message: item.message,
      isRead: item.is_read,
      createdAt: item.created_at,
      resourceId: item.resource_id || undefined,
      resourceType: item.resource_type || undefined,
    }));
  } catch (err) {
    console.error("[EduTogo] Erreur lors du chargement des notifications :", err);
    return [];
  }
}

export async function markNotificationRead(notificationId: number): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("[EduTogo] Erreur lors du marquage de notification comme lue :", err);
    return false;
  }
}

export function normalizeStoragePath(path: string): string {
  if (!path) return path;
  return path.replace(/^\/storage\//, "").replace(/^\//, "");
}

export function bucketFromStoragePath(path: string): string {
  if (!path) return "media";
  const normalized = normalizeStoragePath(path);
  if (normalized.startsWith("evaluations/")) return "evaluations";
  if (normalized.startsWith("avatars/")) return "avatars";
  return "media";
}

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 60 * 60 * 24,
): Promise<string | null> {
  const supabase = requireSupabase();
  if (!supabase || !path) return null;

  const normalizedPath = normalizeStoragePath(path);
  // Ensure we pass an object path relative to the bucket when calling storage APIs
  const objectPath = normalizedPath.replace(new RegExp(`^${bucket}/`), "");

  // Avatars are public: return the public URL rather than a signed URL.
  if (bucket === "avatars") {
    try {
      const { data } = supabase.storage.from("avatars").getPublicUrl(objectPath);
      return data?.publicUrl || null;
    } catch (err) {
      console.error("[EduTogo] Erreur récupération publicUrl avatars:", err);
      return null;
    }
  }

  // For other buckets (media, evaluations), return a signed URL.
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(objectPath, expiresIn);

  if (error) {
    console.error("[EduTogo] Erreur lors de la génération du signed url :", error);
    return null;
  }
  return data?.signedUrl || null;
}

export async function uploadStorageFile(
  bucket: string,
  path: string,
  file: File,
): Promise<{ path: string; signedUrl: string | null; publicUrl?: string | null } | null> {
  const supabase = requireSupabase();
  if (!supabase) return null;
  const normalizedPath = normalizeStoragePath(path);
  // objectPath is the path inside the bucket (strip any leading bucket/ prefix)
  const objectPath = normalizedPath.replace(new RegExp(`^${bucket}/`), "");

  const { error } = await supabase.storage.from(bucket).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("[EduTogo] Erreur lors du téléversement du fichier :", error);
    return null;
  }

  // For avatars we expose a public URL (no signature) so the image is always reachable.
  let publicUrl: string | null = null;
  if (bucket === "avatars") {
    try {
      const { data } = supabase.storage.from("avatars").getPublicUrl(objectPath);
      publicUrl = data?.publicUrl || null;
    } catch (err) {
      console.error("[EduTogo] Erreur récupération publicUrl avatars:", err);
    }
  }

  const signedUrl = await getSignedUrl(bucket, normalizedPath, 60 * 60 * 24);

  // Return stored path including bucket prefix for consistent round-tripping
  const storedPath = normalizedPath.startsWith(`${bucket}/`) ? normalizedPath : `${bucket}/${normalizedPath}`;
  return { path: storedPath, signedUrl, publicUrl };
}

export async function toggleFavorite(
  resourceId: string,
  resourceType: "course" | "exercise" | "quiz" | "evaluation",
): Promise<boolean | null> {
  const supabase = requireSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("toggle_favorite", {
    p_resource_id: resourceId,
    p_resource_type: resourceType,
  });
  if (error) {
    console.error("[EduTogo] Erreur toggle favori :", error);
    return null;
  }
  return data as boolean; // true = ajouté, false = retiré
};



/**
 * Récupère la liste des favoris de l'utilisateur connecté.
 */
export async function fetchUserFavorites(): Promise<UserFavorite[]> {
  const supabase = requireSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc<string, FavoriteRow[]>("get_user_favorites");

  if (error) {
    console.error("[EduTogo] Erreur chargement des favoris :", error);
    return [];
  }

  if (!data) return [];

  return data.map((f) => ({
    resourceId: f.resource_id,
    resourceType: f.resource_type,
    createdAt: f.created_at,
  }));
}

// ============================================================
// LEVELS
// ============================================================
export async function syncLevel(level: Level): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  const { error } = await supabase.from("levels").upsert({
    id: level.id,
    name: level.name,
    description: level.description || "",
  });
  if (error) {
    console.error("[EduTogo] Erreur lors de la synchronisation du niveau :", error);
    return false;
  }
  return true;
}

export async function deleteLevel(levelId: string): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from("levels").delete().eq("id", levelId);
  return !error;
}

// ============================================================
// SUBJECTS
// ============================================================
export async function syncSubject(subject: Subject): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  const payload = {
    id: subject.id,
    level_id: subject.levelId,
    name: subject.name,
    icon: subject.icon,
    color: subject.color,
    progress: subject.progress,
  };

  const { error } = await supabase.from("subjects").upsert(payload);
  if (error) {
    console.error("[EduTogo] Erreur lors de la synchronisation de la matière :", error);
    return false;
  }
  return true;
}

export async function deleteSubject(subjectId: string): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from("subjects").delete().eq("id", subjectId);
  return !error;
}

// ============================================================
// CHAPTERS
// ============================================================
export async function syncChapter(chapter: Chapter): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  const payload = {
    id: chapter.id,
    subject_id: chapter.subjectId,
    level_id: chapter.levelId,
    number: chapter.number,
    title: chapter.title,
    description: chapter.description || "",
    is_completed: chapter.isCompleted,
    is_locked: chapter.isLocked,
  };

  const { error } = await supabase.from("chapters").upsert(payload);
  if (error) {
    console.error("[EduTogo] Erreur lors de la synchronisation du chapitre :", error);
    return false;
  }
  return true;
}

export async function deleteChapter(chapterId: string): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from("chapters").delete().eq("id", chapterId);
  return !error;
}

export async function syncChapterMedia(
  chapterId: string,
  asset: Asset,
): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  const payload = {
    external_id: asset.id,
    chapter_id: chapterId,
    name: asset.name,
    type: asset.type,
    storage_path: asset.storagePath || asset.url,
    url: asset.url,
    size: asset.size || null,
    metadata: {
      createdAt: asset.createdAt,
    },
  };

  const { error } = await supabase
    .from("media")
    .upsert(payload, { onConflict: "external_id" });

  if (error) {
    console.error("[EduTogo] Erreur lors de la synchronisation du média :", error);
    return false;
  }
  return true;
}

export async function deleteChapterMediaAsset(assetId: string): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  const { data: mediaRow, error: fetchErr } = await supabase
    .from("media")
    .select("storage_path")
    .eq("external_id", assetId)
    .single();

  if (!fetchErr && mediaRow?.storage_path) {
    const normalizedPath = normalizeStoragePath(mediaRow.storage_path);
    const { error: removeErr } = await supabase
      .storage
      .from("media")
      .remove([normalizedPath]);

    if (removeErr) {
      console.warn(
        "[EduTogo] Impossible de supprimer le fichier stocké du bucket media :",
        removeErr,
      );
    }
  }

  const { error } = await supabase
    .from("media")
    .delete()
    .eq("external_id", assetId);

  return !error;
}

// ============================================================
// COURSES (+ sections)
// ============================================================
export async function syncCourse(course: Course): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  const idVal = parseId(course.id);
  const payload: any = {
    chapter_id: course.chapterId,
    title: course.title,
    content: course.content,
  };
  if (idVal !== undefined) payload.id = idVal;

  const { data, error: courseErr } = await supabase
    .from("courses")
    .upsert(payload)
    .select();
  if (courseErr) {
    console.error("[EduTogo] Erreur lors de la synchronisation du cours :", courseErr);
    return false;
  }

  const databaseCourseId = data && data[0] ? data[0].id : idVal;
  if (databaseCourseId === undefined) {
    console.error(
      "[EduTogo] Impossible de déterminer l'id du cours après la synchronisation.",
    );
    return false;
  }

  if (course.sections && course.sections.length > 0) {
    return syncCourseSections(databaseCourseId, course.sections);
  }

  // Si le cours n'a plus de sections, on supprime les anciennes pour rester cohérent.
  const { error: deleteErr } = await supabase
    .from("course_sections")
    .delete()
    .eq("course_id", databaseCourseId);
  if (deleteErr) {
    console.error(
      "[EduTogo] Erreur lors de la suppression des anciennes sections :",
      deleteErr,
    );
    return false;
  }

  if (idVal === undefined) {
    course.id = String(databaseCourseId);
  }

  return true;
}

async function syncCourseSections(
  courseId: number,
  sections: CourseSection[],
): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  const deleteResult = await supabase
    .from("course_sections")
    .delete()
    .eq("course_id", courseId);

  if (deleteResult.error) {
    console.error(
      "[EduTogo] Erreur lors de la suppression des anciennes sections :",
      deleteResult.error,
    );
    return false;
  }

  const sortedSections = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));
  const sectionsToInsert = sortedSections.map((sec, idx) => ({
    course_id: courseId,
    title: sec.title,
    content: sec.content || "",
    order_num: idx + 1,
  }));

  const { error: sectionsErr } = await supabase
    .from("course_sections")
    .insert(sectionsToInsert);
  if (sectionsErr) {
    console.error("[EduTogo] Erreur lors de la synchronisation des sections :", sectionsErr);
    return false;
  }

  return true;
}

export async function deleteCourse(courseId: string): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;
  const idVal = parseId(courseId);
  if (idVal === undefined) return false;
  const { error } = await supabase.from("courses").delete().eq("id", idVal);
  return !error;
}

// ============================================================
// EXERCISES
// ============================================================
export async function syncExercise(exercise: Exercise): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  const idVal = parseId(exercise.id);
  const numVal = parseInt(exercise.number, 10);
  const payload: any = {
    chapter_id: exercise.chapterId,
    number: isNaN(numVal) ? 1 : numVal,
    title: exercise.title,
    question: exercise.question,
    hint: exercise.hint,
    solution: exercise.solution,
    category: exercise.category || "exercice",
  };
  if (idVal !== undefined) payload.id = idVal;

  const { data, error } = await supabase.from("exercises").upsert(payload).select();
  if (error) {
    console.error("[EduTogo] Erreur lors de la synchronisation de l'exercice :", error);
    return false;
  }
  if (data && data[0] && idVal === undefined) {
    exercise.id = String(data[0].id);
  }
  return true;
}

export async function deleteExercise(exerciseId: string): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;
  const idVal = parseId(exerciseId);
  if (idVal === undefined) return false;
  const { error } = await supabase.from("exercises").delete().eq("id", idVal);
  return !error;
}

// ============================================================
// QUIZZES
// ============================================================
export async function syncQuiz(quiz: QuizQuestion): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;
  // Backwards-compatible sync: keep legacy `quizzes` table up-to-date
  // while also creating/updating the new grouped model `quiz_groups` + `quiz_questions`.
  try {
    const idVal = parseId(quiz.id);
    const legacyPayload: any = {
      chapter_id: quiz.chapterId,
      question: quiz.question,
      options: quiz.options,
      correct_index_val: quiz.correctIndex,
      explanation: quiz.explanation,
    };
    if (idVal !== undefined) legacyPayload.id = idVal;

    const { data: legacyData, error: legacyErr } = await supabase.from("quizzes").upsert(legacyPayload).select();
    if (legacyErr) {
      console.error("[EduTogo] Erreur lors de la synchronisation legacy du quiz :", legacyErr);
      return false;
    }

    const finalId = (legacyData && legacyData[0] && idVal === undefined) ? String(legacyData[0].id) : (quiz.id || String(idVal || ""));
    if (finalId) quiz.id = finalId;

    // Find or create a default group for this chapter if one doesn't exist yet.
    const { data: groupRows, error: groupErr } = await supabase
      .from("quiz_groups")
      .select("*")
      .eq("chapter_id", quiz.chapterId)
      .limit(1);

    let groupId: number | undefined;
    if (groupErr) {
      // not fatal: still try to write the question to quiz_questions without a group
      console.warn("[EduTogo] Impossible de vérifier les quiz_groups :", groupErr);
    } else if (groupRows && groupRows.length > 0) {
      groupId = parseId(groupRows[0].id);
    } else {
      // create a lightweight group for this chapter (admin-created)
      const { data: created, error: createErr } = await supabase.from("quiz_groups").insert({
        chapter_id: quiz.chapterId,
        title: `Admin group - ${quiz.chapterId}`,
      }).select();
      if (!createErr && created && created[0]) {
        groupId = parseId(created[0].id);
      }
    }

    // Upsert into quiz_questions to maintain grouped model (preserve id mapping when possible)
    const qIdVal = parseId(quiz.id);
    const questionPayload: any = {
      chapter_id: quiz.chapterId,
      quiz_group_id: groupId !== undefined ? groupId : null,
      question: quiz.question,
      options: quiz.options || [],
      correct_index_val: quiz.correctIndex ?? 0,
      explanation: quiz.explanation || "",
    };
    if (qIdVal !== undefined) questionPayload.id = qIdVal;

    const { data: qqData, error: qqErr } = await supabase.from("quiz_questions").upsert(questionPayload).select();
    if (qqErr) {
      console.error("[EduTogo] Erreur lors de la synchronisation vers quiz_questions :", qqErr);
      // still consider legacy write successful; return true to avoid blocking other deltas
      return true;
    }

    // If the question was created and we didn't have an id, set it back on the object
    if (qqData && qqData[0] && !quiz.id) {
      quiz.id = String(qqData[0].id);
    }

    return true;
  } catch (err) {
    console.error("[EduTogo] Erreur syncQuiz (dual-write) :", err);
    return false;
  }
}

export async function syncQuizGroup(group: { id?: string; chapterId: string; title?: string; metadata?: any }): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  try {
    const idVal = parseId(group.id);
    const payload: any = {
      chapter_id: group.chapterId,
      title: group.title || null,
      metadata: group.metadata || {},
    };
    if (idVal !== undefined) payload.id = idVal;

    const { data, error } = await supabase.from("quiz_groups").upsert(payload).select();
    if (error) {
      console.error("[EduTogo] Erreur lors de la synchronisation du quiz_group :", error);
      return false;
    }
    if (data && data[0] && idVal === undefined) {
      group.id = String(data[0].id);
    }
    return true;
  } catch (err) {
    console.error("[EduTogo] Erreur syncQuizGroup :", err);
    return false;
  }
}

export async function syncQuizQuestion(question: QuizQuestion): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  try {
    const idVal = parseId(question.id);
    const payload: any = {
      chapter_id: question.chapterId,
      quiz_group_id: question.quizGroupId ? parseId(question.quizGroupId) : null,
      order_num: 0,
      question: question.question,
      options: question.options || [],
      correct_index_val: question.correctIndex ?? 0,
      explanation: question.explanation || "",
    };
    if (idVal !== undefined) payload.id = idVal;

    const { data, error } = await supabase.from("quiz_questions").upsert(payload).select();
    if (error) {
      console.error("[EduTogo] Erreur lors de la synchronisation du quiz_question :", error);
      return false;
    }
    if (data && data[0] && idVal === undefined) {
      question.id = String(data[0].id);
    }

    // Keep legacy table in sync as well (best-effort)
    try {
      const legacyPayload: any = {
        id: question.id ? parseId(question.id) : undefined,
        chapter_id: question.chapterId,
        question: question.question,
        options: question.options || [],
        correct_index_val: question.correctIndex ?? 0,
        explanation: question.explanation || "",
      };
      if (legacyPayload.id === undefined) delete legacyPayload.id;
      await supabase.from("quizzes").upsert(legacyPayload);
    } catch (legacyErr) {
      console.warn("[EduTogo] Échec du dual-write vers quizzes (non bloquant) :", legacyErr);
    }

    return true;
  } catch (err) {
    console.error("[EduTogo] Erreur syncQuizQuestion :", err);
    return false;
  }
}

export async function deleteQuizGroup(groupId: string): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;
  const idVal = parseId(groupId);
  if (idVal === undefined) return false;

  const { error } = await supabase.from("quiz_groups").delete().eq("id", idVal);
  if (error) {
    console.error("[EduTogo] Erreur suppression quiz_group :", error);
    return false;
  }
  return true;
}

export async function deleteQuizQuestion(questionId: string): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;
  const idVal = parseId(questionId);
  if (idVal === undefined) return false;

  // Delete from grouped table; trigger will cascade to legacy if configured, but we also remove legacy row to be safe
  const { error: qErr } = await supabase.from("quiz_questions").delete().eq("id", idVal);
  if (qErr) {
    console.error("[EduTogo] Erreur suppression quiz_question :", qErr);
    return false;
  }

  const { error: legacyErr } = await supabase.from("quizzes").delete().eq("id", idVal);
  if (legacyErr) {
    console.warn("[EduTogo] Erreur suppression legacy quiz row (non bloquant) :", legacyErr);
  }
  return true;
}

export async function deleteQuiz(quizId: string): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;
  const idVal = parseId(quizId);
  if (idVal === undefined) return false;
  const { error } = await supabase.from("quizzes").delete().eq("id", idVal);
  return !error;
}

// ============================================================
// EVALUATIONS
// ============================================================
export async function syncEvaluation(evaluation: Evaluation): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;

  const idVal = parseId(evaluation.id);
  const yrVal = evaluation.year ? parseInt(evaluation.year, 10) : null;
  const payload: any = {
    level_id: evaluation.levelId,
    subject_id: evaluation.subjectId,
    title: evaluation.title,
    type: evaluation.type,
    year: yrVal !== null && isNaN(yrVal) ? null : yrVal,
    has_subject: evaluation.hasSubject,
    has_solution: evaluation.hasSolution,
    subject_url: evaluation.subjectUrl || null,
    solution_url: evaluation.solutionUrl || null,
  };
  if (idVal !== undefined) payload.id = idVal;

  const { data, error } = await supabase.from("evaluations").upsert(payload).select();
  if (error) {
    console.error("[EduTogo] Erreur lors de la synchronisation de l'évaluation :", error);
    return false;
  }
  if (data && data[0] && idVal === undefined) {
    evaluation.id = String(data[0].id);
  }
  return true;
}

export async function deleteEvaluation(evaluationId: string): Promise<boolean> {
  const supabase = requireSupabase();
  if (!supabase) return false;
  const idVal = parseId(evaluationId);
  if (idVal === undefined) return false;

  const { data: evaluationRow, error: fetchErr } = await supabase
    .from("evaluations")
    .select("subject_url, solution_url")
    .eq("id", idVal)
    .single();

  if (!fetchErr && evaluationRow) {
    const cleanupPaths = [evaluationRow.subject_url, evaluationRow.solution_url].filter(
      (path) => typeof path === "string" && path.trim() !== ""
    ) as string[];

    await Promise.all(
      cleanupPaths.map(async (path) => {
        const normalizedPath = normalizeStoragePath(path);
        const { error: removeErr } = await supabase
          .storage
          .from("media")
          .remove([normalizedPath]);
        if (removeErr) {
          console.warn(
            "[EduTogo] Impossible de supprimer le fichier d'évaluation du bucket media :",
            removeErr,
          );
        }
      }),
    );
  }

  const { error } = await supabase.from("evaluations").delete().eq("id", idVal);
  return !error;
}

// ============================================================
// STATS / CHAPITRES POPULAIRES
// ============================================================

/**
 * Incrémente le compteur de vues d'un chapitre (RPC increment_chapter_views).
 * À appeler chaque fois qu'un élève ouvre un chapitre.
 */
export async function trackChapterView(chapterId: string): Promise<void> {
  const supabase = requireSupabase();
  if (!supabase) return;

  try {
    const { error } = await supabase.rpc("increment_chapter_views", {
      p_chapter_id: chapterId,
    });
    if (error) throw error;
  } catch (err) {
    // Le tracking ne doit jamais bloquer l'expérience utilisateur
    console.warn("[EduTogo] Échec du tracking de la vue du chapitre :", err);
  }
}

/**
 * Récupère les chapitres les plus visités via la fonction RPC
 * get_popular_chapters() définie dans le script SQL. Utilisée par la
 * LandingPage pour la section "Leçons & Chapitres Populaires".
 * Retourne un tableau vide en cas d'erreur — pas de données fictives.
 */
export async function fetchPopularChapters(limit: number = 8): Promise<any[]> {
  const supabase = requireSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.rpc("get_popular_chapters", {
      p_limit: limit,
    });
    if (error) throw error;
    if (!data) return [];

    return data.map((item: any) => {
      const subjName: string = item.subject_name || "Général";
      const viewCount: number = item.total_views || 0;
      const lowerName = subjName.toLowerCase();

      return {
        chapterId: item.chapter_id,
        title: item.chapter_title,
        subject: subjName,
        level: item.level_name || "",
        color: lowerName.includes("math")
          ? "from-blue-500 to-cyan-500"
          : lowerName.includes("physique")
            ? "from-orange-500 to-red-500"
            : lowerName.includes("chimie")
              ? "from-emerald-500 to-green-500"
              : "from-indigo-500 to-purple-500",
        icon: lowerName.includes("math")
          ? "Calculator"
          : lowerName.includes("physique")
            ? "Atom"
            : lowerName.includes("chimie")
              ? "FlaskConical"
              : "BookOpen",
        students:
          viewCount >= 1000 ? `${(viewCount / 1000).toFixed(1)}k vues` : `${viewCount} vues`,
      };
    });
  } catch (err) {
    console.error(
      "[EduTogo] Erreur lors du chargement des chapitres populaires (RPC get_popular_chapters) :",
      err,
    );
    return [];
  }
}
