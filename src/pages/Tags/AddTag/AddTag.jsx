/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { serialize } from 'object-to-formdata';
import { Stack, TextField, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Grid from '@material-ui/core/Grid';
import { useStyles } from './style';
import { fetchTags } from '../../../actions/config/config';
import { addTag, updateTag } from '../../../actions/tags/tags';

const initialValues = {
  name: ''
};

const AddTag = ({ handleClose, tags, id }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    name: Yup.string().required('Name is required')
  });

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    enableReinitialize: true,
    onSubmit: ({ name }) => {
      const formData = serialize({ name });

      if (id)
        return updateTag(id, formData).then((res) => {
          if (res.status === 1) {
            formik.resetForm();
            handleClose();
            dispatch(fetchTags);
          }
        });
      return addTag(formData).then((res) => {
        if (res.status === 1) {
          formik.resetForm();
          handleClose();
          dispatch(fetchTags);
        }
      });
    }
  });

  useEffect(() => {
    if (id) {
      const tag = tags?.list.find((tag) => tag.id === id);
      formik.setFieldValue('name', tag.name);
    }
  }, []);

  const {
    errors,
    touched,
    dirty,
    setFieldValue,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps
  } = formik;
  console.log(`values`, values);
  return (
    <div className={classes.formContainer}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Edit' : 'Add'} Tag
        </Typography>
      </Stack>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  label="Name"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
            </Grid>
          </Stack>
          <div className={classes.btnWapper}>
            <LoadingButton
              // fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ mt: 2 }}
              disabled={!dirty}
            >
              {!id ? 'Add' : '  Update'}
            </LoadingButton>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

AddTag.propTypes = {
  handleClose: PropTypes.func,
  tags: PropTypes.object,
  id: PropTypes.number
};

const mapStateToProps = (state) => ({
  tags: state.config.tags
});

export default connect(mapStateToProps)(AddTag);
