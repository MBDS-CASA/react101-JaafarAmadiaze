import { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Pagination, Dialog, DialogTitle, DialogContent, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, SortAsc, SortDesc } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [allGrades, setAllGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
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
        
        // Store all grades for later use FIRST
        if (Array.isArray(data)) {
          setAllGrades(data);
        }
        
        // Extract unique courses from the array
        const uniqueCourses = [];
        const courseNames = new Set();
        
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item.course && !courseNames.has(item.course)) {
              courseNames.add(item.course);
              uniqueCourses.push({ name: item.course });
            }
          });
        }
        
        setCourses(uniqueCourses);
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

  const paginatedCourses = courses.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  
  const getCourseGrades = (courseName) => {
    return allGrades.filter(item => item.course === courseName);
  };

  // Filter and sort courses
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const paginatedFilteredCourses = sortedCourses.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalFilteredPages = Math.ceil(sortedCourses.length / itemsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#2563eb', textAlign: 'center' }}>
        📚 Nos Cours
      </Typography>

      {/* Search and Sort Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Rechercher un cours..."
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
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#2563eb',
              },
            },
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

      {courses.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#64748b', py: 8 }}>
          Aucun cours trouvé
        </Typography>
      ) : sortedCourses.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#64748b', py: 8 }}>
          Aucun résultat pour "{searchTerm}"
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
            {paginatedFilteredCourses.map((course, index) => (
              <Box
                key={index}
                onClick={() => setSelectedCourse(course)}
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
                    <span style={{ fontSize: '1.5rem' }}>📖</span>
                  </Box>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.name || course.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '1.5rem', color: '#0284c7' }}>→</Typography>
                </Box>
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
              Total: {sortedCourses.length} cours · Affichage: {paginatedFilteredCourses.length}
            </Typography>
          </Box>
        </>
      )}

      {/* Course Details Dialog */}
      <Dialog open={!!selectedCourse} onClose={() => setSelectedCourse(null)} maxWidth="md" fullWidth>
        {selectedCourse && (
          <>
            <DialogTitle sx={{ background: 'linear-gradient(to right, #2563eb, #0284c7)', color: 'white', fontWeight: 'bold' }}>
              📚 {selectedCourse.name}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 2 }}>
                  👥 Étudiants inscrits et leurs notes
                </Typography>
                
                {getCourseGrades(selectedCourse.name).length === 0 ? (
                  <Typography sx={{ color: '#64748b' }}>Aucun étudiant trouvé</Typography>
                ) : (
                  <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {getCourseGrades(selectedCourse.name).map((grade, idx) => {
                      const gradeNum = grade.grade;
                      let bgColor = '#dcfce7';
                      let gradeColor = '#16a34a';
                      
                      if (gradeNum < 14) {
                        bgColor = '#fee2e2';
                        gradeColor = '#dc2626';
                      } else if (gradeNum < 16) {
                        bgColor = '#fef3c7';
                        gradeColor = '#ca8a04';
                      } else if (gradeNum < 18) {
                        bgColor = '#dbeafe';
                        gradeColor = '#2563eb';
                      }
                      
                      return (
                        <Box
                          key={idx}
                          sx={{
                            p: 2,
                            mb: 2,
                            backgroundColor: bgColor,
                            borderLeft: `4px solid ${gradeColor}`,
                            borderRadius: '0.5rem'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                                {grade.student?.firstname} {grade.student?.lastname}
                              </Typography>
                              <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>
                                {grade.date ? new Date(grade.date).toLocaleDateString('fr-FR') : 'N/A'}
                              </Typography>
                            </Box>
                            <Box sx={{
                              backgroundColor: gradeColor,
                              color: 'white',
                              px: 2,
                              py: 1,
                              borderRadius: '0.5rem',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              minWidth: '70px'
                            }}>
                              {grade.grade}/20
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  onClick={() => setSelectedCourse(null)}
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: '#2563eb' }}
                >
                  Fermer
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
