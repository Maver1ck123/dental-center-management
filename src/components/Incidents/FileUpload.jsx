import React, { useState, useEffect, useRef } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  Paper,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import { 
  CloudUpload, 
  Delete, 
  Download, 
  InsertDriveFile, 
  Image,
  PictureAsPdf,
  Description 
} from '@mui/icons-material';

export default function FileUpload({ onUpload, initialFiles = [] }) {
  const [files, setFiles] = useState(initialFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const validateFile = (file) => {
    if (file.size > maxFileSize) {
      return `File ${file.name} is too large. Maximum size is 10MB.`;
    }
    if (!allowedTypes.includes(file.type)) {
      return `File ${file.name} type is not supported.`;
    }
    return null;
  };

  const processFiles = async (selectedFiles) => {
    setError('');
    setUploading(true);
    setUploadProgress(0);

    const validFiles = [];
    for (const file of selectedFiles) {
      const validation = validateFile(file);
      if (validation) {
        setError(validation);
        setUploading(false);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      setUploading(false);
      return;
    }

    try {
      const newFiles = await Promise.all(
        validFiles.map((file, index) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              setUploadProgress(((index + 1) / validFiles.length) * 100);
              resolve({
                id: Date.now() + index,
                name: file.name,
                type: file.type,
                size: file.size,
                url: e.target.result,
                uploadDate: new Date().toISOString()
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onUpload(updatedFiles);
    } catch (error) {
      setError('Error processing files. Please try again.');
      console.error("Error reading files:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input value to allow same file selection
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type && type.startsWith('image/')) {
      return <Image color="primary" />;
    }
    if (type === 'application/pdf') {
      return <PictureAsPdf color="error" />;
    }
    if (type === 'application/msword' || 
        type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return <Description color="info" />;
    }
    return <InsertDriveFile color="action" />;
  };

  const getFileTypeLabel = (type) => {
    if (type && type.startsWith('image/')) return 'IMG';
    if (type === 'application/pdf') return 'PDF';
    if (type === 'application/msword') return 'DOC';
    if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'DOCX';
    return type ? type.split('/')[1]?.toUpperCase() : 'FILE';
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Upload Files (Images, Invoices, Reports)
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 3, 
          border: isDragOver ? '2px dashed #1976d2' : '2px dashed #ccc', 
          backgroundColor: isDragOver ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
          textAlign: 'center',
          mb: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(25, 118, 210, 0.04)'
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          {isDragOver ? 'Drop files here' : 'Drag & drop files here or click to browse'}
        </Typography>
        <Button 
          variant="contained" 
          component="label"
          startIcon={<CloudUpload />}
          disabled={uploading}
          sx={{ mb: 1 }}
        >
          {uploading ? 'Uploading...' : 'Select Files'}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            onChange={handleFileChange}
          />
        </Button>
        <Typography variant="body2" color="text.secondary">
          Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 10MB each)
        </Typography>
        
        {uploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption" color="text.secondary">
              Uploading files... {Math.round(uploadProgress)}%
            </Typography>
          </Box>
        )}
      </Paper>

      {files.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Files ({files.length})
          </Typography>
          <List>
            {files.map((file, index) => (
              <ListItem 
                key={index}
                sx={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1, 
                  mb: 1,
                  backgroundColor: '#fafafa'
                }}
              >
                <Box sx={{ mr: 1 }}>
                  {getFileIcon(file.type)}
                </Box>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight="medium">
                        {file.name}
                      </Typography>
                      {file.type && (                      <Chip 
                        label={getFileTypeLabel(file.type)} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {file.size ? formatFileSize(file.size) : 'Unknown size'}
                      </Typography>
                      {file.uploadDate && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          • {new Date(file.uploadDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                
                {file.type && file.type.startsWith('image/') && (
                  <Box sx={{ mr: 2 }}>
                    <img
                      src={file.url}
                      alt={file.name}
                      style={{ 
                        width: 60, 
                        height: 60, 
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                  </Box>
                )}
                
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      // For demo purposes, show alert. In real app, implement download
                      if (file.url.startsWith('data:')) {
                        const link = document.createElement('a');
                        link.href = file.url;
                        link.download = file.name;
                        link.click();
                      } else {
                        alert(`Downloading ${file.name}`);
                      }
                    }}
                    title="Download"
                  >
                    <Download />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => removeFile(index)}
                    title="Remove"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
