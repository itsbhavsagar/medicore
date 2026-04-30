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
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-muted">
              <span className="h-2 w-2 rounded-full bg-accent" />
              patients
            </p>
            <h2 className="mt-3 text-[28px] font-medium tracking-[-0.03em] text-foreground">
              Search and review active patient records
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Switch between a quick-scan grid and a denser list view while
              keeping the current patient selection in shared state.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle
              onChange={(value) => {
                setView(value);
                setCurrentPage(1);
              }}
              value={viewMode}
            />
            <Button className="cursor-pointer" onClick={openAddPatient}>
              Add patient
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-3 lg:max-w-3xl lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              className="h-12 w-full rounded-xl border border-border bg-surface px-12 text-sm text-foreground outline-none transition placeholder:text-subtle focus:border-primary"
              onChange={(event) => {
                setLocalSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by patient, diagnosis, doctor, department, or room"
              type="search"
              value={localSearch}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>Rows per page</span>
          <select
            className="h-9 cursor-pointer rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none"
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
        {viewMode === "grid" ? (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
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
            <div className="hidden grid-cols-[1.5fr_0.8fr_1.2fr_0.8fr_0.9fr] gap-4 px-5 text-xs font-medium text-subtle xl:grid">
              <span>Patient</span>
              <span>Diagnosis</span>
              <span>Status</span>
              <span>Room</span>
              <span>Last visit</span>
            </div>

            {paginatedPatients.map((patient) => (
              <motion.div key={patient.id} layout>
                <PatientRow onSelect={selectPatient} patient={patient} />
              </motion.div>
            ))}
          </motion.section>
        )}
      </AnimatePresence>
      <div className="flex justify-center rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            className="cursor-pointer"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            size="sm"
            variant="secondary"
          >
            Previous
          </Button>
          {visiblePages.map((page) => (
            <button
              className={
                page === safeCurrentPage
                  ? "h-9 min-w-9 cursor-pointer rounded-xl bg-primary text-sm font-medium text-white"
                  : "h-9 min-w-9 cursor-pointer rounded-xl border border-border bg-surface text-sm font-medium text-foreground"
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
