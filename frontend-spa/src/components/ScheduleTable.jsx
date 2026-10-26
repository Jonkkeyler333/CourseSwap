import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

const START_HOUR = 6
const END_HOUR = 22
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const formatTime = (hour) => `${String(hour).padStart(2, '0')}:00`

const ScheduleTable = ({ calendar }) => (
  <TableContainer
    sx={{
      maxHeight: 680,
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
                py: 1.5,
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
                    height: 56,
                    p: 0.75,
                    verticalAlign: 'top',
                    transition: 'background-color 160ms ease',
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                >
                  {courses.map((course) => (
                    <Box
                      key={`${course.id}-${hour}`}
                      sx={{
                        border: 1,
                        borderLeft: 4,
                        borderColor: 'primary.main',
                        bgcolor: (theme) => theme.palette.mode === 'dark'
                          ? 'rgba(56, 189, 248, 0.14)'
                          : 'rgba(25, 118, 210, 0.08)',
                        color: 'primary.main',
                        borderRadius: 1.5,
                        px: 1.25,
                        py: 0.75,
                        mb: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        lineHeight: 1.35,
                        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
                      }}
                    >
                      {course.materiaNombre || course.materiaCodigo || 'Materia'} · {course.grupoNombre || 'Grupo'}
                    </Box>
                  ))}
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
