export function PageFooter() {
  return (
    <footer className="flex flex-col gap-2 border-t border-gray-600 pt-5 text-center md:flex-row md:items-end">
      <div>Copyright &copy; 2024 Drew Butler.</div>
      <div>
        Built with{' '}
        <span className="material-symbols-outlined text-xs text-accent">
          favorite
        </span>{' '}
        in Brooklyn, NY.
      </div>
    </footer>
  );
}
