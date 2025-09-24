import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import { itemService } from '../../../services';
import type { Item, CreateItemRequest, UpdateItemRequest } from '../../../types';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Container, Snackbar, Alert, TextField, Typography, MenuItem, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Minimal toast system (self-contained)
  const pushToast = (_type: 'success' | 'error' | 'info', message: string) => {
    // Redirect toast messages to MUI Snackbar via success/formError
    setSuccess(message);
  };

  // Build absolute URL for images served from BE /uploads
  const apiBase = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_API_URL || 'http://localhost:5000/api';
  const apiOrigin = apiBase.replace(/\/api\/?$/, '');
  const isValidImagePath = (path: string): boolean => {
    if (!path) return false;
    if (path.includes('<') || path.includes('>')) return false;
    return /^https?:\/\//i.test(path) || path.startsWith('/uploads/') || path.startsWith('uploads/');
  };

  const resolveImageUrl = (path: string): string => {
    if (!path) return '';
    try { path = decodeURIComponent(path); } catch { /* ignore malformed URI */ }
    if (!isValidImagePath(path)) return '';
    // If already absolute (http/https), return as is
    if (/^https?:\/\//i.test(path)) return path;
    // Normalize missing leading slash for uploads
    const normalized = path.startsWith('uploads/') ? `/${path}` : path;
    return `${apiOrigin}${normalized.startsWith('/') ? '' : '/'}${normalized}`;
  };

  const defaultForm: CreateItemRequest = useMemo(() => ({
    itemName: '',
    itemType: 'weapon',
    itemPrice: 0,
    itemImage: ''
  }), []);

  const [formData, setFormData] = useState<CreateItemRequest>(defaultForm);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await itemService.getAllItems({ limit: 50 });
      if (res.success) {
        const data = res.data as unknown;
        let list: Item[] = [];
        if (Array.isArray(data)) {
          list = data as Item[];
        } else if (
          data && typeof data === 'object' &&
          Array.isArray((data as { items?: unknown }).items)
        ) {
          list = (data as { items: Item[] }).items;
        }
        setItems(list);
      } else {
        setError(res.message || 'Không thể tải vật phẩm');
        pushToast('error', res.message || 'Không thể tải vật phẩm');
      }
    } catch {
      setError('Không thể tải vật phẩm');
      pushToast('error', 'Không thể tải vật phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // We intentionally avoid adding fetchItems as a dependency because it's stable in this component scope.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingItem(null);
    setFormError(null);
  };

  const onCreateNew = () => {
    resetForm();
    setShowForm(true);
  };

  const onEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      itemType: item.itemType,
      itemPrice: item.itemPrice,
      itemImage: item.itemImage || ''
    });
    setShowForm(true);
  };

  const onDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa vật phẩm này?')) return;
    setSubmitting(true);
    setFormError(null);
    setSuccess(null);
    try {
      const res = await itemService.deleteItem(id);
      if (res.success) {
        setSuccess('Xóa vật phẩm thành công');
        pushToast('success', 'Xóa vật phẩm thành công');
        await fetchItems();
      } else {
        setFormError(res.message || 'Xóa vật phẩm thất bại');
        pushToast('error', res.message || 'Xóa vật phẩm thất bại');
      }
    } catch {
      setFormError('Xóa vật phẩm thất bại');
      pushToast('error', 'Xóa vật phẩm thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setSuccess(null);

    const validation = itemService.validateItemData(formData);
    if (!validation.isValid) {
      setSubmitting(false);
      setFormError(validation.errors.join('\n'));
      return;
    }

    try {
      if (editingItem) {
        const payload: UpdateItemRequest = {
          itemName: formData.itemName,
          itemType: formData.itemType,
          itemPrice: formData.itemPrice,
          itemImage: formData.itemImage
        };
        const res = await itemService.updateItem(editingItem._id, payload);
        if (res.success) {
          setSuccess('Cập nhật vật phẩm thành công');
          pushToast('success', 'Cập nhật vật phẩm thành công');
          setShowForm(false);
          resetForm();
          await fetchItems();
        } else {
          setFormError(res.message || 'Cập nhật vật phẩm thất bại');
          pushToast('error', res.message || 'Cập nhật vật phẩm thất bại');
        }
      } else {
        const payload: CreateItemRequest = {
          itemName: formData.itemName,
          itemType: formData.itemType,
          itemPrice: formData.itemPrice,
          itemImage: formData.itemImage
        };
        const res = await itemService.createItem(payload);
        if (res.success) {
          setSuccess('Tạo vật phẩm thành công');
          pushToast('success', 'Tạo vật phẩm thành công');
          setShowForm(false);
          resetForm();
          await fetchItems();
        } else {
          setFormError(res.message || 'Tạo vật phẩm thất bại');
          pushToast('error', res.message || 'Tạo vật phẩm thất bại');
        }
      }
    } catch {
      setFormError('Có lỗi xảy ra, vui lòng thử lại');
      pushToast('error', 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Vật phẩm">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>Quản lý vật phẩm</Typography>
            <Typography variant="body2" color="text.secondary">Tạo, chỉnh sửa và xóa vật phẩm trong hệ thống</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} color="success" onClick={onCreateNew}>Thêm vật phẩm</Button>
        </Stack>

      {success && (
        <div className="mb-3 p-3 rounded-md bg-green-50 text-green-700 border border-green-200">{success}</div>
      )}

      {showForm && (
        <Box sx={{ mb: 4 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>{editingItem ? 'Sửa vật phẩm' : 'Thêm vật phẩm'}</Typography>
            {formError && (
              <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>{formError}</Alert>
            )}
            <Box component="form" onSubmit={onSubmit} sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2
            }}>
              <Box>
                <TextField
                  fullWidth
                  label="Tên vật phẩm"
                  value={formData.itemName}
                  onChange={e => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                  placeholder="VD: Kiếm gỗ"
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  select
                  label="Loại"
                  value={formData.itemType}
                  onChange={e => setFormData(prev => ({ ...prev, itemType: e.target.value as Item['itemType'] }))}
                >
                  <MenuItem value="weapon">Vũ khí</MenuItem>
                  <MenuItem value="armor">Giáp</MenuItem>
                  <MenuItem value="consumable">Tiêu hao</MenuItem>
                  <MenuItem value="decoration">Trang trí</MenuItem>
                  <MenuItem value="special">Đặc biệt</MenuItem>
                </TextField>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  label="Giá (VND)"
                  value={formData.itemPrice}
                  onChange={e => setFormData(prev => ({ ...prev, itemPrice: Number(e.target.value) }))}
                  inputProps={{ min: 0 }}
                />
              </Box>
              <Box>
                <Button variant="outlined" component="label">
                  Chọn ảnh
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setSubmitting(true);
                      setFormError(null);
                      setSuccess(null);
                      try {
                        const res = await itemService.uploadItemImage(file);
                        if (res.success && res.data?.url) {
                          setFormData(prev => ({ ...prev, itemImage: res.data!.url }));
                          setSuccess('Upload ảnh thành công');
                        } else {
                          setFormError(res.message || 'Upload ảnh thất bại');
                        }
                      } catch {
                        setFormError('Upload ảnh thất bại');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  />
                </Button>
                {formData.itemImage && (
                  <Box sx={{ mt: 1 }}>
                    <img src={resolveImageUrl(formData.itemImage)} alt="preview" style={{ height: 96, width: 96, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  </Box>
                )}
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Stack direction="row" spacing={1.5}>
                  <Button type="submit" variant="contained" disabled={submitting}> {submitting ? 'Đang lưu...' : 'Gửi'} </Button>
                  <Button variant="outlined" onClick={() => { setShowForm(false); resetForm(); }} disabled={submitting}>Hủy</Button>
                </Stack>
              </Box>
            </Box>
          </Card>
        </Box>
      )}

      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 opacity-80">
          <div className="text-5xl mb-3">🗂️</div>
          <div className="mb-2">Chưa có vật phẩm nào.</div>
          <button className="px-3 py-2 rounded-md border" onClick={onCreateNew}>+ Thêm vật phẩm đầu tiên</button>
        </div>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr', xl: '1fr 1fr 1fr 1fr' },
          gap: 2
        }}>
          {items.map(i => (
            <Card key={i._id} elevation={1} sx={{ height: '100%' }}>
              {i.itemImage ? (
                <CardMedia component="img" image={resolveImageUrl(i.itemImage)} alt={i.itemName} sx={{ height: 160, objectFit: 'cover' }} />
              ) : (
                <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>🎁</Box>
              )}
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight={600}>{i.itemName}</Typography>
                <Chip size="small" label={itemService.getItemTypeLabel(i.itemType)} sx={{ mt: 0.5, mb: 1 }} />
                <Typography variant="body2" color="primary">Giá: {itemService.formatPrice(i.itemPrice)}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" variant="outlined" onClick={() => onEdit(i)}>Sửa</Button>
                <Button size="small" color="error" variant="contained" onClick={() => onDelete(i._id)} disabled={submitting}>Xóa</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
      <Snackbar open={!!success || !!formError} autoHideDuration={2500} onClose={() => { setSuccess(null); setFormError(null); }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {success ? (
          <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
        ) : formError ? (
          <Alert severity="error" onClose={() => setFormError(null)}>{formError}</Alert>
        ) : (
          <span />
        )}
      </Snackbar>
      </Container>
    </AdminLayout>
  );
};

export default ItemsPage;


