import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ActorEntry } from '../types'

interface SortableActorItemProps {
  id: string
  entry: ActorEntry
  index: number
  onRoleChange: (index: number, role: string) => void
  onActorChange: (index: number, actor: string) => void
  onDelete: (index: number) => void
}

function SortableActorItem({
  id,
  entry,
  index,
  onRoleChange,
  onActorChange,
  onDelete,
}: SortableActorItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="actor-entry">
      <span className="drag-handle" {...attributes} {...listeners}>
        ☰
      </span>
      <input
        type="text"
        className="actor-input actor-role"
        placeholder="Роль"
        value={entry.role}
        onChange={(e) => onRoleChange(index, e.target.value)}
      />
      <input
        type="text"
        className="actor-input actor-name"
        placeholder="Актёр"
        value={entry.actor}
        onChange={(e) => onActorChange(index, e.target.value)}
      />
      <button
        type="button"
        className="btn-delete-entry"
        onClick={() => onDelete(index)}
        title="Удалить"
      >
        ×
      </button>
    </div>
  )
}

interface ActorsEditorProps {
  value: ActorEntry[]
  onChange: (actors: ActorEntry[]) => void
}

function ActorsEditor({ value, onChange }: ActorsEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const hasEmptyFields = value.some(
    (entry) => !entry.role.trim() || !entry.actor.trim()
  )

  const handleAddActor = () => {
    if (hasEmptyFields) return
    onChange([...value, { role: '', actor: '' }])
  }

  const handleRoleChange = (index: number, role: string) => {
    const updated = [...value]
    updated[index] = { ...updated[index], role }
    onChange(updated)
  }

  const handleActorChange = (index: number, actor: string) => {
    const updated = [...value]
    updated[index] = { ...updated[index], actor }
    onChange(updated)
  }

  const handleDelete = (index: number) => {
    const updated = value.filter((_, i) => i !== index)
    onChange(updated)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id as string)
      const newIndex = parseInt(over.id as string)
      onChange(arrayMove(value, oldIndex, newIndex))
    }
  }

  return (
    <div className="actors-editor">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={value.map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="actors-list">
            {value.map((entry, index) => (
              <SortableActorItem
                key={index}
                id={index.toString()}
                entry={entry}
                index={index}
                onRoleChange={handleRoleChange}
                onActorChange={handleActorChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        className={`btn-add-actor ${hasEmptyFields ? 'disabled' : ''}`}
        onClick={handleAddActor}
        disabled={hasEmptyFields}
        title={hasEmptyFields ? 'Заполните все поля' : 'Добавить актёра'}
      >
        +
      </button>
    </div>
  )
}

export default ActorsEditor
