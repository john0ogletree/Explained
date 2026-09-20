/* Tag header (on /tags/[tag] page) */
.tag-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.tag-label {
  color: var(--muted);
  font-size: 0.9rem;
}
.tag-name {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fcd34d, #f59e0b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tag-count {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--muted);
  background: var(--card);
  border: 1px solid var(--border);
  padding: 2px 10px;
  border-radius: 999px;
}
