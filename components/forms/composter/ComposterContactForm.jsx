import React, { useContext } from 'react'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import { Box, Button, CircularProgress, TextField } from '@material-ui/core'
import api from '~/utils/api'
import { ComposterContext } from '~context/ComposterContext'

const ContactSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required('Le champ email est obligatoire'),
  message: Yup.string().required('Le champ message est obligatoire')
})

/**
 * La fameux formulaire de contact
 */

const ComposterContactForm = () => {
  const {
    composterContext: { composter }
  } = useContext(ComposterContext)

  const initialValues = {
    email: '',
    message: ''
  }

  const submit = async (values, { resetForm, setSubmitting }) => {
    const res = await api.sendComposterContact({ ...values, composter: composter['@id'] })
    if (res.status === 201) {
      resetForm(initialValues)
    }
    setSubmitting(false)
  }

  return (
    <Box>
      <Formik initialValues={initialValues} validationSchema={ContactSchema} enableReinitialize onSubmit={submit}>
        {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
          <Form>
            <TextField
              fullWidth
              required
              InputLabelProps={{
                shrink: true
              }}
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email ? errors.email : null}
            />

            <TextField
              fullWidth
              required
              label="Message"
              multiline
              InputLabelProps={{
                shrink: true
              }}
              rows={5}
              name="message"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.message && touched.message}
              helperText={errors.message && touched.message ? errors.message : null}
            />
            <Box my={2} align="center">
              <Button type="submit" variant="contained" color="secondary">
                {isSubmitting ? <CircularProgress /> : 'Envoyer'}
                {console.log('TCL: isSubmitting', isSubmitting)}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default ComposterContactForm
