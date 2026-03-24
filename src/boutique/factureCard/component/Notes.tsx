import { Paper, Typography } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

export default function Notes({ notes }: { notes: string }) {
  if (!notes) return null;

  return (
    <Paper 
      elevation={0}
      sx={{
        backgroundColor: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0',
      }}
    >
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <CommentIcon sx={{ color: '#64748b' }} />
          <Typography 
            variant="subtitle2"
            sx={{ 
              color: '#475569',
              fontWeight: 600,
            }}
          >
            Notes et commentaires
          </Typography>
        </div>
        
        <Typography 
          variant="body2"
          sx={{ 
            color: '#64748b',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
          }}
        >
          {notes}
        </Typography>
      </div>
    </Paper>
  );
}
