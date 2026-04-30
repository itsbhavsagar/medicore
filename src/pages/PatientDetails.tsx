import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AddPatientModal } from "../components/patients/AddPatientModal";
import { PatientCard } from "../components/patients/PatientCard";
import { PatientRow } from "../components/patients/PatientRow";
import { PatientSidePanel } from "../components/patients/PatientSidePanel";
import { ViewToggle } from "../components/patients/ViewToggle";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useNotifications } from "../hooks/useNotifications";
import { usePatients } from "../hooks/usePatients";

const SEARCH_DEBOUNCE_MS = 250;
const pageSizeOptions = [5, 10, 25, 100] as const;

export function PatientDetails() {
  const {
    addPatient,
    filteredPatients,
    selectedPatient,
    searchQuery,
    selectPatient,
    setSearch,
    setView,
    viewMode,
  } = usePatients();
  const { add: addNotification } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof pageSizeOptions)[number]>(5);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const isAddModalOpen = searchParams.get("new") === "1";

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPatients = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;

    return filteredPatients.slice(startIndex, startIndex + pageSize);
  }, [filteredPatients, pageSize, safeCurrentPage]);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setSearch(localSearch),
      SEARCH_DEBOUNCE_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [localSearch, setSearch]);

  const openAddPatient = () => {
    setSearchParams({ new: "1" });
  };

  const closeAddPatient = () => {
    setSearchParams({});
  };

  const visiblePages = useMemo(() => {
    const maxVisiblePages = 5;
    const halfWindow = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, safeCurrentPage - halfWindow);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );
  }, [safeCurrentPage, totalPages]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-3 sm:gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted">
              <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
              <span>patients</span>
            </p>
            <h2 className="mt-2 sm:mt-3 text-lg sm:text-2xl md:text-[28px] font-medium tracking-[-0.03em] text-foreground line-clamp-2 sm:line-clamp-none">
              Search and review active patient records
            </h2>
            <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm leading-5 sm:leading-6 text-muted line-clamp-3 sm:line-clamp-none">
              Switch between a quick-scan grid and a denser list view while
              keeping the current patient selection in shared state.
            </p>
          </div>
          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3 shrink-0">
            <ViewToggle
              onChange={(value) => {
                setView(value);
                setCurrentPage(1);
              }}
              value={viewMode}
            />
            <Button
              className="min-h-9 w-full cursor-pointer text-xs sm:min-h-10 sm:w-auto sm:text-sm"
              onClick={openAddPatient}
            >
              Add patient
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="pointer-events-none absolute left-3 sm:left-4 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-subtle shrink-0" />
          <input
            className="h-9 sm:h-10 w-full rounded-xl border border-border bg-surface px-9 sm:px-12 text-xs sm:text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
            onChange={(event) => {
              setLocalSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search patient, diagnosis, doctor..."
            type="search"
            value={localSearch}
          />
        </div>

        <div className="hidden sm:flex  items-center gap-2 shrink-0 sm:ml-auto">
          <span className="text-xs sm:text-sm text-muted whitespace-nowrap">
            Rows per page
          </span>
          <select
            className="h-9 sm:h-10 w-20 cursor-pointer rounded-xl border border-border bg-surface px-3 text-xs sm:text-sm text-foreground outline-none transition focus:border-primary"
            onChange={(event) => {
              setPageSize(
                Number(event.target.value) as (typeof pageSizeOptions)[number],
              );
              setCurrentPage(1);
            }}
            value={pageSize}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {paginatedPatients.length === 0 ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface py-16 text-center"
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
          >
            <Search className="h-8 w-8 text-subtle" />
            <p className="text-sm font-medium text-foreground">
              No patients found
            </p>
            <p className="text-xs text-muted">
              Try adjusting your search query
            </p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 8 }}
            key="grid-view"
            layout
            transition={{ duration: 0.22 }}
          >
            {paginatedPatients.map((patient) => (
              <motion.div key={patient.id} layout>
                <PatientCard onSelect={selectPatient} patient={patient} />
              </motion.div>
            ))}
          </motion.section>
        ) : (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
            initial={{ opacity: 0, y: 8 }}
            key="list-view"
            transition={{ duration: 0.22 }}
          >
            <div className="hidden grid-cols-[1.5fr_0.8fr_1.2fr_0.8fr_0.9fr] gap-4 px-3 text-xs font-medium text-subtle sm:grid sm:px-5">
              <span>Patient</span>
              <span className="hidden sm:inline">Diagnosis</span>
              <span>Status</span>
              <span className="hidden sm:inline">Room</span>
              <span className="hidden sm:inline">Last visit</span>
            </div>

            {paginatedPatients.map((patient) => (
              <motion.div key={patient.id} layout>
                <PatientRow onSelect={selectPatient} patient={patient} />
              </motion.div>
            ))}
          </motion.section>
        )}
      </AnimatePresence>
      {paginatedPatients.length > 0 && (
        <div className="flex justify-center rounded-xl border border-border bg-surface p-2 sm:p-4">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            <Button
              className="cursor-pointer min-h-8 sm:min-h-9 px-2 sm:px-3 text-xs sm:text-sm"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              size="sm"
              variant="secondary"
            >
              Prev
            </Button>
            {visiblePages.map((page) => (
              <button
                className={
                  page === safeCurrentPage
                    ? "h-8 sm:h-9 min-w-8 sm:min-w-9 cursor-pointer rounded-xl bg-primary text-xs sm:text-sm font-medium text-white"
                    : "h-8 sm:h-9 min-w-8 sm:min-w-9 cursor-pointer rounded-xl border border-border bg-surface text-xs sm:text-sm font-medium text-foreground"
                }
                key={page}
                onClick={() => setCurrentPage(page)}
                type="button"
              >
                {page}
              </button>
            ))}
            <Button
              className="cursor-pointer"
              disabled={safeCurrentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              size="sm"
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <PatientSidePanel
        onClose={() => selectPatient(null)}
        patient={selectedPatient}
      />
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={closeAddPatient}
        onSubmit={(patient) => {
          const createdPatient = addPatient(patient);
          addNotification({
            id: `patient-created-${createdPatient.id}`,
            message: `${createdPatient.name} was added to the patient roster.`,
            title: "Patient added",
          });
        }}
      />
    </div>
  );
}
