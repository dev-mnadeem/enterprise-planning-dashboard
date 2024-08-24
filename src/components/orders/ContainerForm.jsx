import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import ErrorMsg from '../error-msg';
import { Box, Button, Card, Divider } from '@mui/material';
import { CustomDropdown } from '../common';
import { SHIPMENT_ROUTE, createContainerSchema, createPricingSchema } from 'src/constants';
import _ from 'lodash';
import NumberField from '../common/Input/NumberField';
import Iconify from '../iconify/iconify';
import { ADD_PRICING_INITIALS } from 'src/sections/pricing/utils';
import useMemoized from 'src/hooks/useMemoized';
import { useLazyQuery, useQuery } from 'src/api';
import { ENDPOINTS } from 'src/api/Endpoints';
import toast from 'react-hot-toast';
import { ADD_CONTAINER_INITIALS } from 'src/sections/containers/utils';

export default function ContainerForm({ onSubmit, initials, viewOnly, buttonText }) {
  const [initialValues, setInitialValues] = useState({ ...initials });
  const { data: countries, cntLoading, cntError } = useQuery(ENDPOINTS.COUNTRIES);

  const countriesOptions = useMemoized(
    countries?.map((country) => ({ value: country.id, label: country.name })),
    [countries]
  );

  const onSubmitForm = (values) => {
    onSubmit({ ...values });
  };

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onSubmitForm}
      validationSchema={createContainerSchema}
      initialValues={initials ? initialValues : ADD_CONTAINER_INITIALS}
    >
      {({
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        values,
      }) => {
        useEffect(() => {
          /** PREFILL COUNTRY, STATE, CITY In EDIT CASE */
          const prefillLocationData = async () => {
            try {
              if (initialValues?.from_city_id) {
                const _fromLocation = initialValues?.from_city;
                const {
                  id: _fromCityId,
                  state: { id: _fromStateId, country_id: _fromCountryId },
                } = _fromLocation;

                await setFieldValue('from_country_id', _fromCountryId);
                await setFieldValue('sender_state', _fromStateId);

                await setFieldValue('from_city_id', _fromCityId);
              }
              if (initialValues?.to_city_id) {
                const _toLocation = initialValues?.to_city;
                const {
                  id: _toCityId,
                  state: { id: _toStateId, country_id: _toCountryId },
                } = _toLocation;

                await setFieldValue('to_country_id', _toCountryId);
                await setFieldValue('receiver_state', _toStateId);

                await setFieldValue('to_city_id', _toCityId);
              }
            } catch (error) {
              toast.error('Issue occurred while prefilling data.');
            }
          };

          // prefillLocationData();
        }, [initialValues?.from_city_id]);

        useEffect(() => {
          // if (initialValues?.route) {
          //   setFieldValue('shipment_route', initialValues?.route);
          //   getRoutePackagings({
          //     route: initialValues?.route === SEA ? 'sea' : 'air',
          //   }).then(() => {
          //     setFieldValue('package_id', initialValues?.package_id);
          //   });
          // }
        }, [initialValues?.route]);

        //..........................
        const onChangeDimensions = (dimension) => {
          if (dimension?.width && dimension?.height && dimension?.depth) {
            setFieldValue(
              'volume',
              (+dimension?.width * +dimension?.height * +dimension?.depth).toFixed(2)
            );
          }
        };

        const onChangeWeightLimit = (value) => {
          setFieldValue('volume', value);
          if (value >= 0.0) {
            setFieldValue('width', Math.cbrt(value)?.toFixed(2));
            setFieldValue('height', Math.cbrt(value)?.toFixed(2));
            setFieldValue('depth', Math.cbrt(value)?.toFixed(2));
          }
        };

        const receiverCountryOptions = useMemoized(
          countriesOptions?.filter((option) => option.value !== values?.from_country_id),
          [countriesOptions, values?.from_country_id]
        );
        const senderCountryOptions = useMemoized(
          countriesOptions?.filter((option) => option.value !== values?.to_country_id),
          [countriesOptions, values?.to_country_id]
        );

        return (
          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <fieldset disabled={viewOnly ?? false} className="border-none">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  <Box>
                    <CustomDropdown
                      title="From Country"
                      name="from_country_id"
                      required
                      placeholder="Select Country"
                      options={senderCountryOptions}
                      value={useMemoized(
                        countriesOptions?.find((item) => item.value === values.from_country_id),
                        [countriesOptions, values.from_country_id]
                      )}
                      onValueChange={async (value) => {
                        setFieldTouched('from_country_id', true);
                        setFieldValue('from_country_id', value.value);
                      }}
                    />
                    {touched.from_country_id && errors?.from_country_id && (
                      <ErrorMsg error={errors.from_country_id} />
                    )}
                  </Box>

                  <Box>
                    <CustomDropdown
                      title="To Country"
                      name="to_country_id"
                      required
                      placeholder="Select Country"
                      options={receiverCountryOptions}
                      value={useMemoized(
                        countriesOptions?.find((item) => item.value === values.to_country_id),
                        [countriesOptions, values.to_country_id]
                      )}
                      onValueChange={async (value) => {
                        setFieldTouched('to_country_id', true);
                        setFieldValue('to_country_id', value.value);
                      }}
                    />
                    {touched.to_country_id && errors?.to_country_id && (
                      <ErrorMsg error={errors.to_country_id} />
                    )}
                  </Box>

                  <Box>
                    <NumberField
                      name="width"
                      title="Width"
                      fullWidth
                      unit={'m'}
                      value={values.width}
                      isCustomOnChange={true}
                      onChange={async (event) => {
                        await setFieldValue('width', event.target.value);
                        onChangeDimensions({
                          ...values,
                          width: event.target.value,
                        });
                      }}
                    />
                    {touched.width && errors?.width && <ErrorMsg error={errors.width} />}
                  </Box>

                  <Box>
                    <NumberField
                      name="height"
                      title="Height"
                      unit={'m'}
                      value={values.height}
                      isCustomOnChange={true}
                      onChange={async (event) => {
                        await setFieldValue('height', event.target.value);
                        onChangeDimensions({
                          ...values,
                          height: event.target.value,
                        });
                      }}
                    />
                    {touched.height && errors?.height && <ErrorMsg error={errors.height} />}
                  </Box>

                  <Box>
                    <NumberField
                      name="depth"
                      title="Depth"
                      unit={'m'}
                      value={values.depth}
                      isCustomOnChange={true}
                      onChange={async (event) => {
                        await setFieldValue('depth', event.target.value);
                        onChangeDimensions({
                          ...values,
                          depth: event.target.value,
                        });
                      }}
                    />
                    {touched.depth && errors?.depth && <ErrorMsg error={errors.depth} />}
                  </Box>

                  <Box>
                    <NumberField
                      name="volume"
                      title={'Volume Limit'}
                      unit={'cbm'}
                      value={values.volume}
                      isCustomOnChange={true}
                      onChange={(e) => onChangeWeightLimit(e.target.value)}
                    />
                    {touched.volume && errors?.volume && <ErrorMsg error={errors.volume} />}
                  </Box>
                </div>

                <Divider className="my-4" />

                {viewOnly ? null : (
                  <Button
                    type="submit"
                    variant="contained"
                    className="col-span-2 mt-6"
                    color="inherit"
                    sx={{
                      padding: '12px 16px',
                      float: 'right',
                    }}
                    startIcon={<Iconify icon="eva:navigation-2-outline" />}
                  >
                    {buttonText}
                  </Button>
                )}
              </fieldset>
            </form>
          </Card>
        );
      }}
    </Formik>
  );
}
