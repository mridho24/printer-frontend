import { Children, forwardRef, isValidElement, useId, useMemo } from 'react';
import { cn } from '../../lib/cn.js';
import SelectMenu from './SelectMenu.jsx';

export function Field({ label, htmlFor, labelId, error, hint, required = false, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label id={labelId} htmlFor={htmlFor} className="block text-sm font-medium text-ink">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-danger">{error}</p>
      ) : (
        hint && <p className="text-xs text-faint">{hint}</p>
      )}
    </div>
  );
}

function teksAnak(children) {
  return Children.toArray(children)
    .map((anak) => {
      if (typeof anak === 'string' || typeof anak === 'number') return String(anak);
      if (isValidElement(anak)) return teksAnak(anak.props.children);
      return '';
    })
    .join('');
}

function bacaOpsi(children, hasil = []) {
  Children.forEach(children, (anak, indeks) => {
    if (!isValidElement(anak)) return;

    if (anak.type === 'option') {
      const label = teksAnak(anak.props.children).trim();
      const nilai = anak.props.value !== undefined ? String(anak.props.value) : label;
      hasil.push({
        key: anak.key ?? `${nilai}-${indeks}`,
        value: nilai,
        label: label || nilai,
        disabled: Boolean(anak.props.disabled),
      });
      return;
    }

    if (anak.type === 'optgroup') {
      bacaOpsi(anak.props.children, hasil);
    }
  });

  return hasil;
}


function gayaDasar(error, lebar = 'w-full') {
  return cn(
    'block rounded-md border bg-surface px-3 py-2 text-sm text-ink transition-colors placeholder:text-faint disabled:bg-paper disabled:text-faint',
    lebar,
    error ? 'border-danger' : 'border-line-strong',
  );
}

export const Input = forwardRef(function Input(
  { label, error, hint, required, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <Field
      label={label}
      htmlFor={inputId}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        className={cn(gayaDasar(error), 'h-10 max-lg:h-11')}
        {...props}
      />
    </Field>
  );
});

export const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    required,
    inline = false,
    size,
    ariaLabel,
    className,
    id,
    children,
    value,
    disabled = false,
    onChange,
    name,
  },
  ref,
) {
  const autoId = useId();
  const selectId = id || autoId;
  const labelId = `${selectId}-label`;
  const options = useMemo(() => bacaOpsi(children), [children]);
  const ukuran = size ?? (inline ? 'sm' : 'md');
  const labelledBy = label ? labelId : undefined;

  if (inline) {
    return (
      <div className={cn('space-y-1', className)}>
        <div className="flex items-center gap-2">
          {label && (
            <label
              id={labelId}
              htmlFor={selectId}
              className="shrink-0 text-xs font-medium text-muted"
            >
              {label}
              {required && (
                <span className="ml-0.5 text-danger" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}
          <div className="min-w-0 flex-1">
            <SelectMenu
              ref={ref}
              id={selectId}
              labelledBy={labelledBy}
              ariaLabel={ariaLabel}
              options={options}
              value={value}
              onChange={onChange}
              name={name}
              disabled={disabled}
              invalid={Boolean(error)}
              required={Boolean(required)}
              size={ukuran}
            />
          </div>
        </div>
        {error ? (
          <p className="text-xs font-medium text-danger">{error}</p>
        ) : (
          hint && <p className="text-xs text-faint">{hint}</p>
        )}
      </div>
    );
  }

  return (
    <Field
      label={label}
      htmlFor={selectId}
      labelId={labelId}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <SelectMenu
        ref={ref}
        id={selectId}
        labelledBy={labelledBy}
        ariaLabel={ariaLabel}
        options={options}
        value={value}
        onChange={onChange}
        name={name}
        disabled={disabled}
        invalid={Boolean(error)}
        required={Boolean(required)}
        size={ukuran}
      />
    </Field>
  );
});

export function Toggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors disabled:opacity-50',
          checked ? 'border-accent bg-accent' : 'border-line-strong bg-paper',
        )}
      >
        <span
          className={cn(
            'pointer-events-none absolute top-0.5 left-0.5 inline-block h-4.5 w-4.5 rounded-full transition-transform',
            checked ? 'translate-x-5 bg-surface' : 'translate-x-0 bg-line-strong',
          )}
        />
      </button>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="mt-0.5 text-xs text-faint">{description}</p>}
      </div>
    </div>
  );
}

export function CheckboxCard({ checked, onChange, label, description, swatch }) {
  return (
    <label
      className={cn(
        'flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors',
        checked
          ? 'border-accent bg-accent-soft'
          : 'border-line bg-surface hover:border-line-strong hover:bg-paper',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-accent"
      />
      {swatch && (
        <span
          className={cn('h-3.5 w-3.5 rounded-sm border border-line-strong', swatch)}
          aria-hidden="true"
        />
      )}
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="block text-xs text-faint">{description}</span>}
      </span>
    </label>
  );
}

export function ReadOnlyValue({ label, value, hint, placeholder = '-' }) {
  return (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium text-ink">{label}</p>}
      <div className="flex h-10 items-center rounded-md border border-line bg-paper px-3 text-sm font-medium text-ink">
        {value || <span className="font-normal text-faint">{placeholder}</span>}
      </div>
      {hint && <p className="text-xs text-faint">{hint}</p>}
    </div>
  );
}
