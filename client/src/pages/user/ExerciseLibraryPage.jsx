import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { exerciseApi } from "../../api/exerciseApi";
import ExerciseCard from "../../components/exercises/ExerciseCard";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { difficultyOptions, equipmentOptions, muscleGroups } from "../../constants/app";

export default function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    muscleGroup: "",
    equipment: "",
    difficulty: "",
  });

  useEffect(() => {
    exerciseApi
      .getAll()
      .then(({ data }) => setExercises(data.exercises || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = filters.search.toLowerCase().trim();
    return exercises.filter((exercise) => {
      const matchesSearch =
        !query ||
        exercise.name.toLowerCase().includes(query) ||
        exercise.instructions?.toLowerCase().includes(query);
      const matchesMuscle = !filters.muscleGroup || exercise.muscleGroup === filters.muscleGroup;
      const matchesEquipment = !filters.equipment || exercise.equipment === filters.equipment;
      const matchesDifficulty = !filters.difficulty || exercise.difficulty === filters.difficulty;
      return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty;
    });
  }, [exercises, filters]);

  if (loading) return <Loader label="Loading exercise library" />;

  return (
    <div>
      <PageHeader
        kicker="Shared exercise catalogue"
        title="Exercise Library"
        copy="Browse each movement before adding it to a personal workout plan."
      />

      <section className="glass-card mb-7 grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(3,1fr)]">
        <label className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            className="field pl-11"
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            placeholder="Search exercises"
          />
        </label>

        <select
          className="select-field"
          value={filters.muscleGroup}
          onChange={(event) => setFilters({ ...filters, muscleGroup: event.target.value })}
        >
          <option value="">All muscle groups</option>
          {muscleGroups.map((item) => <option key={item}>{item}</option>)}
        </select>

        <select
          className="select-field"
          value={filters.equipment}
          onChange={(event) => setFilters({ ...filters, equipment: event.target.value })}
        >
          <option value="">All equipment</option>
          {equipmentOptions.map((item) => <option key={item}>{item}</option>)}
        </select>

        <select
          className="select-field"
          value={filters.difficulty}
          onChange={(event) => setFilters({ ...filters, difficulty: event.target.value })}
        >
          <option value="">All difficulty</option>
          {difficultyOptions.map((item) => <option key={item}>{item}</option>)}
        </select>
      </section>

      <div className="mb-5 flex items-center gap-2 text-xs text-muted">
        <SlidersHorizontal size={15} />
        {filtered.length} of {exercises.length} exercises
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((exercise) => <ExerciseCard key={exercise._id} exercise={exercise} />)}
        {!filtered.length && (
          <EmptyState
            title="No exercises match these filters"
            copy="Adjust the search or remove one of the selected filters."
          />
        )}
      </section>
    </div>
  );
}
