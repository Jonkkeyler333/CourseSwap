import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { COURSE_COLORS, DAYS, END_HOUR, START_HOUR } from '../constants/constants'

const formatTime = (hour) => `${String(hour).padStart(2, '0')}:00`

const ScheduleTable = ({ calendar }) => (
  <TableContainer
    sx={{
      maxHeight: 590,
      border: 1,
      borderColor: 'divider',
      borderRadius: 3,
      bgcolor: 'background.paper',
      '&::-webkit-scrollbar': { height: 8, width: 8 },
      '&::-webkit-scrollbar-thumb': { bgcolor: 'action.disabled', borderRadius: 4 },
    }}
  >
    <Table
      stickyHeader
      size="small"
      sx={{
        minWidth: 900,
        tableLayout: 'fixed',
        '& .MuiTableCell-root': { borderColor: 'divider' },
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell
            sx={{
              width: 82,
              fontWeight: 800,
              color: 'text.secondary',
              bgcolor: 'background.paper',
              py: 0.75,
              px: 1,
              borderRight: 1,
              borderColor: 'divider',
            }}
          >
            Hora
          </TableCell>
          {DAYS.map((day, index) => (
            <TableCell
              key={day}
              align="center"
              sx={{
                minWidth: 115,
                py: 0.75,
                fontWeight: 800,
                bgcolor: 'background.paper',
                color: index === 0 ? 'primary.main' : 'text.primary',
                borderBottom: 2,
                borderColor: index === 0 ? 'primary.main' : 'divider',
              }}
            >
              {day}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: END_HOUR - START_HOUR }, (_, index) => START_HOUR + index).map((hour) => (
          <TableRow
            key={hour}
            sx={{
              '&:nth-of-type(even)': { bgcolor: 'action.hover' },
              '&:last-child td': { borderBottom: 0 },
            }}
          >
            <TableCell
              sx={{
                color: 'text.secondary',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                bgcolor: 'action.hover',
                py: 0.35,
                px: 1,
                borderRight: 1,
                borderColor: 'divider',
              }}
            >
              {formatTime(hour)}
            </TableCell>
            {DAYS.map((day, dayIndex) => {
              const courses = calendar.get(`${hour}-${dayIndex}`) || []
              return (
                <TableCell
                  key={day}
                  sx={{
                    height: 36,
                    p: 0.5,
                    verticalAlign: 'top',
                    transition: 'background-color 160ms ease',
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                >
                  {courses.map(({ enrollment, colorIndex }) => {
                    const colors = COURSE_COLORS[colorIndex % COURSE_COLORS.length]
                    return (
                      <Box
                        key={`${enrollment.id}-${hour}`}
                        sx={{
                          border: 1,
                          borderLeft: 3,
                          borderColor: colors.accent,
                          bgcolor: (theme) => theme.palette.mode === 'dark' ? colors.dark : colors.light,
                          color: (theme) => theme.palette.mode === 'dark' ? '#f8fafc' : '#172033',
                          borderRadius: 1,
                          px: 0.75,
                          py: 0.25,
                          minHeight: 30,
                          height: 'calc(100% - 4px)',
                          display: 'flex',
                          alignItems: 'center',
                          mb: 0.25,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          lineHeight: 1.15,
                          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
                        }}
                      >
                        {enrollment.materiaNombre || enrollment.materiaCodigo || 'Materia'} · {enrollment.grupoNombre || 'Grupo'}
                      </Box>
                    )
                  })}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export default ScheduleTable
