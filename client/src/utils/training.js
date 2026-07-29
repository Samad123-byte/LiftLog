export function getExerciseId(value) {
  return value?._id || value || "";
}

export function uniqueMuscleGroups(plan) {
  return [
    ...new Set(
      (plan?.exercises || [])
        .map((item) => item.exercise?.muscleGroup)
        .filter(Boolean),
    ),
  ];
}

export function estimatePlanMinutes(plan) {
  if (!plan?.exercises?.length) return 0;

  const seconds = plan.exercises.reduce((total, item) => {
    const sets = Number(item.sets) || 0;
    const rest = Number(item.restTime) || 60;
    const workingTime = sets * 42;
    const restingTime = Math.max(0, sets - 1) * rest;
    const transitionTime = 75;
    return total + workingTime + restingTime + transitionTime;
  }, 0);

  return Math.max(10, Math.round(seconds / 60));
}

function localDayKey(value) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function dayDiff(from, to) {
  const first = new Date(`${from}T00:00:00`);
  const second = new Date(`${to}T00:00:00`);
  return Math.round((second - first) / 86_400_000);
}

export function calculateCurrentStreak(sessions = []) {
  const days = [...new Set(sessions.map((session) => localDayKey(session.completedAt)))].sort(
    (a, b) => b.localeCompare(a),
  );

  if (!days.length) return 0;

  const today = localDayKey(new Date());
  const latestDistance = dayDiff(days[0], today);

  if (latestDistance > 1) return 0;

  let streak = 1;

  for (let index = 1; index < days.length; index += 1) {
    if (dayDiff(days[index], days[index - 1]) === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function estimateCalories(durationMinutes = 0, bodyWeightKg = 0) {
  const duration = Number(durationMinutes) || 0;
  const weight = Number(bodyWeightKg) || 0;

  if (!duration || !weight) return null;

  // Approximate vigorous resistance-training estimate (about 6 MET).
  return Math.round(duration * weight * 0.105);
}

export function relativeWorkoutDate(value) {
  if (!value) return "No sessions yet";

  const target = localDayKey(value);
  const today = localDayKey(new Date());
  const difference = dayDiff(target, today);

  if (difference === 0) return "Today";
  if (difference === 1) return "Yesterday";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function getPreviousRecord(record, sessions = []) {
  const exerciseId = getExerciseId(record?.exercise);
  const currentSessionId = getExerciseId(record?.workoutSession);
  const achievedAt = new Date(record?.achievedAt || Date.now()).getTime();

  let previous = {
    weight: 0,
    reps: 0,
  };

  sessions.forEach((session) => {
    const sessionId = getExerciseId(session);
    const completedAt = new Date(session.completedAt || 0).getTime();

    if (sessionId === currentSessionId || completedAt > achievedAt) return;

    const performed = (session.exercises || []).find(
      (item) => getExerciseId(item.exercise) === exerciseId,
    );

    (performed?.sets || []).forEach((set) => {
      const weight = Number(set.weight) || 0;
      const reps = Number(set.reps) || 0;

      if (
        weight > previous.weight ||
        (weight === previous.weight && reps > previous.reps)
      ) {
        previous = { weight, reps };
      }
    });
  });

  return previous;
}

export function recordProgress(record, previous) {
  const currentWeight = Number(record?.bestWeight) || 0;
  const currentReps = Number(record?.bestReps) || 0;

  if (!previous.weight && !previous.reps) {
    return {
      label: "First record",
      value: "New",
    };
  }

  if (currentWeight > previous.weight) {
    return {
      label: "Weight progress",
      value: `+${Number((currentWeight - previous.weight).toFixed(1))} kg`,
    };
  }

  if (currentWeight === previous.weight && currentReps > previous.reps) {
    return {
      label: "Rep progress",
      value: `+${currentReps - previous.reps} reps`,
    };
  }

  return {
    label: "Progress",
    value: "Maintained",
  };
}

export function splitGuidance(value) {
  if (!value) return [];

  return String(value)
    .split(/\n|;/)
    .map((item) => item.replace(/^[-•\d.)\s]+/, "").trim())
    .filter(Boolean);
}

export function getYouTubeEmbedUrl(value) {
  if (!value) return "";

  try {
    const url = new URL(value);
    let videoId = "";

    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    } else if (url.hostname.includes("youtube.com")) {
      videoId = url.searchParams.get("v") || url.pathname.split("/").pop();
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
}
