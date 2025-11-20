import { TableCell as BaseTableCell } from '@tiptap/extension-table-cell'

export const CustomTableCell = BaseTableCell.extend({
  content: 'inline*',
  allowGapCursor: true,
  isolating: true,
})
