const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)] text-[var(--text)]">
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
