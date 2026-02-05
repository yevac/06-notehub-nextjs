import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={css.pagination}>
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? css.active : undefined}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}
