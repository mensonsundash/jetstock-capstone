import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack } from "@mui/material";

/**
 * Reusable cateogry form dialog: Used for both create and edit actions
 * open: controls dialog is visible or not
 * onClose: function to close the dialog
 * onSubmit: submit form data
 * initialValues: if null then empty form for add New data / or if has data then used for preload edit
 * submitting: controls loading state of submit button
 */
const CategoryForm = ({
    open,
    onClose,
    onSubmit,
    initialValues = null,
    submitting = false
}) =>{
    // getting user state from auth Context
    const { user } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        name:"",
        description: ""
    });

    // validation / error
    const [error, setError] = useState("");

    // populating form when editing
    // -everytime when 'initialValues' changes: dependency array value
    useEffect(() => {
        if(initialValues) {
            setFormData({
                name: initialValues.name || "",
                description: initialValues.description || ""
            });
        }else{
            setFormData({
                name: "",
                description: ""
            });
        }

        setError("");
    }, [initialValues, open]);

    // handle text field changes
    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // submit form data to parent page
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if(!formData.name) {
            setError("Category name is required");
            return;
        }

        try{
            await onSubmit({
                user_id: user.id,
                name: formData.name.trim(),
                description:formData.description.trim()
            });
        } catch(error) {
            setError(error.response.data.message || 'Failed to save category');
        }
    }

    return(
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>{ initialValues ? "Edit Category" : "Add Category" }</DialogTitle>

            <DialogContent>
                <Stack component="form" spacing={2} sx={{ mt: 1 }} onSubmit={handleSubmit}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField label="Category Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
                    <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline minRows={3} />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px:3, pb: 2 }}>
                <Button variant="contained" onClick={handleSubmit} disabled={submitting}> 
                    { 
                    submitting ? 
                        initialValues ? "Updating..." : "Creating..."  : 
                        initialValues ? "Update": "Create"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CategoryForm;