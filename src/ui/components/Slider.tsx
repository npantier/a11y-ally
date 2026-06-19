interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

export function Slider({ label, min, max, step, value, onChange }: SliderProps) {
  const inputId = `aa-slider-${label.toLowerCase()}`;
  return (
    <label className="aa-slider" htmlFor={inputId}>
      <span>{label}</span>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      <span>{value.toFixed(1)}×</span>
    </label>
  );
}
