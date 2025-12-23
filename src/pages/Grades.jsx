import { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Pagination, TextField, InputAdornment, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Search, SortAsc, SortDesc } from 'lucide-react';

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('student');
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
        
        // Extract grades from the array
        const gradesData = [];
        if (Array.isArray(data)) {
          data.forEach(item => {
            gradesData.push({
              student: item.student?.firstname + ' ' + item.student?.lastname || 'N/A',
              course: item.course || 'N/A',
              grade: item.grade || 0,
              date: item.date
            });
          });
        }
        
        setGrades(gradesData);
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

  const paginatedGrades = grades.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(grades.length / itemsPerPage);

  // Filter and sort grades
  const filteredGrades = grades.filter(grade =>
    grade.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedGrades = [...filteredGrades].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'student') {
      comparison = a.student.localeCompare(b.student);
    } else if (sortField === 'course') {
      comparison = a.course.localeCompare(b.course);
    } else if (sortField === 'grade') {
      comparison = a.grade - b.grade;
    } else if (sortField === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const paginatedFilteredGrades = sortedGrades.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalFilteredPages = Math.ceil(sortedGrades.length / itemsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#2563eb', textAlign: 'center' }}>
        📊 Notes des Étudiants
      </Typography>

      {/* Search and Sort Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          placeholder="Rechercher par étudiant ou cours..."
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
            flex: 1,
            minWidth: '200px',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
          }}
        />
        <FormControl sx={{ minWidth: '150px', backgroundColor: 'white', borderRadius: '0.5rem' }}>
          <InputLabel>Trier par</InputLabel>
          <Select
            value={sortField}
            label="Trier par"
            onChange={(e) => setSortField(e.target.value)}
          >
            <MenuItem value="student">Étudiant</MenuItem>
            <MenuItem value="course">Cours</MenuItem>
            <MenuItem value="grade">Note</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
        </FormControl>
        <IconButton
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          sx={{
            backgroundColor: '#2563eb',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
          }}
        >
          {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
        </IconButton>
      </Box>

      {grades.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#64748b', py: 8 }}>
          Aucune note trouvée
        </Typography>
      ) : sortedGrades.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#64748b', py: 8 }}>
          Aucun résultat pour "{searchTerm}"
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
            {paginatedFilteredGrades.map((grade, index) => {
              const gradeNum = parseInt(grade.grade);
              let bgGradient = 'linear-gradient(to bottom right, #dcfce7, #bbf7d0)';
              let borderColor = '#86efac';
              let icon = '⭐';
              
              if (gradeNum < 14) {
                bgGradient = 'linear-gradient(to bottom right, #fee2e2, #fecaca)';
                borderColor = '#fca5a5';
                icon = '⚠️';
              } else if (gradeNum < 16) {
                bgGradient = 'linear-gradient(to bottom right, #fef3c7, #fde68a)';
                borderColor = '#fcd34d';
                icon = '📈';
              } else if (gradeNum < 18) {
                bgGradient = 'linear-gradient(to bottom right, #cffafe, #a5f3fc)';
                borderColor = '#67e8f9';
                icon = '✨';
              }
              
              return (
                <Box
                  key={index}
                  sx={{
                    background: bgGradient,
                    borderRadius: '1rem',
                    border: `2px solid ${borderColor}`,
                    padding: '1.5rem',
                    height: '16rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(37, 99, 235, 0.25)',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', flex: 1 }}>
                        {grade.student || 'N/A'}
                      </Typography>
                      <Typography sx={{ fontSize: '1.5rem', ml: 1 }}>{icon}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.95rem', color: '#4b5563', mt: 1 }}>
                      {grade.course || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      {grade.date ? new Date(grade.date).toLocaleDateString('fr-FR') : 'N/A'}
                    </Typography>
                    <Typography sx={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {grade.grade}/20
                    </Typography>
                  </Box>
                </Box>
              );
            })}
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
              Total: {sortedGrades.length} notes · Affichage: {paginatedFilteredGrades.length}
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
}
