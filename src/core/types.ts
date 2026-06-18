export interface NodeState {
  disabled?: boolean;
  required?: boolean;
  checked?: boolean | 'mixed';
  expanded?: boolean;
  selected?: boolean;
}

export interface AnnounceableNode {
  /** Stable id used to map back to the DOM element across contexts. */
  id: string;
  /** ARIA role (explicit or resolved implicit), e.g. "button", "heading". */
  role: string;
  /** Computed accessible name; "" when the element has none. */
  name: string;
  state: NodeState;
  /** Current value for inputs/comboboxes. */
  value?: string;
  /** Heading level when role === "heading". */
  level?: number;
  /** Set position for list items etc. */
  setInfo?: { position: number; size: number };
}
