import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Box, Container, Typography, CircularProgress, Alert, Pagination, Dialog, DialogTitle, DialogContent, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, SortAsc, SortDesc } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [allGrades, setAllGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 9;

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('Impossible de charger les données');
        }
        const data = await response.json();
        
        // Extract unique students from the array
        const studentsMap = new Map();
        if (Array.isArray(data)) {
          data.forEach(item => {
            const studentId = item.student?.id;
            const studentName = item.student?.firstname + ' ' + item.student?.lastname;
            
            if (studentId && !studentsMap.has(studentId)) {
              studentsMap.set(studentId, {
                id: studentId,
                name: studentName,
                email: `${item.student?.firstname?.toLowerCase()}.${item.student?.lastname?.toLowerCase()}@school.com`,
                status: 'Active'
              });
            }
          });
        }
        
        const studentsData = Array.from(studentsMap.values());
        setStudents(studentsData);
        
        // Store all grades for later use
        if (Array.isArray(data)) {
          setAllGrades(data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Erreur: {error}</Alert>
      </Container>
    );
  }

  const paginatedStudents = students.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const getStudentGrades = (studentId) => {
    return allGrades.filter(item => item.student?.id === studentId);
  };

  // Filter and sort students
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const paginatedFilteredStudents = sortedStudents.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalFilteredPages = Math.ceil(sortedStudents.length / itemsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#2563eb', textAlign: 'center' }}>
        👥 Liste des Étudiants
      </Typography>

      {/* Search and Sort Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
          }}
        />
        <IconButton
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          sx={{
            backgroundColor: '#2563eb',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
            padding: '12px',
          }}
        >
          {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
        </IconButton>
      </Box>

      {students.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#64748b', py: 8 }}>
          Aucun étudiant trouvé
        </Typography>
      ) : sortedStudents.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#64748b', py: 8 }}>
          Aucun résultat pour "{searchTerm}"
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
            {paginatedFilteredStudents.map((student, index) => (
              <Box
                key={index}
                sx={{
                  background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)',
                  borderRadius: '1rem',
                  border: '2px solid #bfdbfe',
                  padding: '1.5rem',
                  height: '16rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(37, 99, 235, 0.25)',
                    transform: 'scale(1.05)',
                    borderColor: '#3b82f6'
                  }
                }}
              >
                <Box>
                  <Box sx={{ width: '3rem', height: '3rem', background: 'linear-gradient(to bottom right, #2563eb, #06b6d4)', borderRadius: '0.75rem', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>👤</span>
                  </Box>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>
                    {student.name || 'N/A'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: '#475569', mt: 1 }}>
                    Actif
                  </Typography>
                </Box>
                <Button
                  onClick={() => setSelectedStudent(student)}
                  sx={{
                    width: '100%',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#1d4ed8'
                    }
                  }}
                >
                  Détails
                </Button>
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Pagination
              count={totalFilteredPages}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                  fontWeight: '600'
                }
              }}
            />
          </Box>

          {/* Summary */}
          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e0f2fe', borderRadius: '0.5rem', borderLeft: '4px solid #0284c7' }}>
            <Typography sx={{ fontWeight: 'bold', color: '#0369a1' }}>
              Total: {sortedStudents.length} étudiants · Affichage: {paginatedFilteredStudents.length}
            </Typography>
          </Box>
        </>
      )}

      {/* Details Dialog */}
      <Dialog open={!!selectedStudent} onClose={() => setSelectedStudent(null)} maxWidth="sm" fullWidth>
        {selectedStudent && (
          <>
            <DialogTitle sx={{ background: 'linear-gradient(to right, #2563eb, #0284c7)', color: 'white', fontWeight: 'bold' }}>
              {selectedStudent.name}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 1 }}>
                  📧 Email
                </Typography>
                <Typography sx={{ color: '#475569', mb: 3 }}>
                  {selectedStudent.email}
                </Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
                  📚 Grades dans les cours
                </Typography>
                
                {getStudentGrades(selectedStudent.id).length === 0 ? (
                  <Typography sx={{ color: '#64748b' }}>Aucune note trouvée</Typography>
                ) : (
                  <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {getStudentGrades(selectedStudent.id).map((grade, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: '#f0f9ff',
                          borderLeft: '4px solid #2563eb',
                          borderRadius: '0.5rem'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                              {grade.course}
                            </Typography>
                            <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>
                              {grade.date ? new Date(grade.date).toLocaleDateString('fr-FR') : 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{
                            backgroundColor: '#2563eb',
                            color: 'white',
                            px: 2,
                            py: 1,
                            borderRadius: '0.5rem',
                            fontWeight: 'bold',
                            textAlign: 'center'
                          }}>
                            {grade.grade}/20
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Button
                onClick={() => setSelectedStudent(null)}
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#2563eb' }}
              >
                Fermer
              </Button>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}