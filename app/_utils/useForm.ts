import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'


export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type Errors = Record<string, string>

export type FormDataConvertible =
    | Array<FormDataConvertible>
    | { [key: string]: FormDataConvertible }
    | Blob
    | FormDataEntryValue
    | Date
    | boolean
    | number
    | null
    | undefined

export type RequestPayload = Record<string, FormDataConvertible> | FormData

export type VisitOptions = Partial<
    {
        headers: Record<string, string>
        forceFormData: boolean
        onFinish: () => void
        onSuccess: (response: Response) => void
        onError: (errors: Errors) => void
    }
>

type setDataByObject<TForm> = (data: TForm) => void
type setDataByMethod<TForm> = (data: (previousData: TForm) => TForm) => void
type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(key: K, value: TForm[K]) => void

export interface UseFormProps<TForm extends Record<string, unknown>> {
    data: TForm
    errors: Partial<Record<keyof TForm, string>>
    hasErrors: boolean
    processing: boolean
    setProcessing: Dispatch<SetStateAction<boolean>>
    wasSuccessful: boolean
    recentlySuccessful: boolean
    setData: setDataByObject<TForm> & setDataByMethod<TForm> & setDataByKeyValuePair<TForm>
    transform: (callback: (data: TForm) => TForm) => void
    setDefaults(): void
    setDefaults(field: keyof TForm, value: string): void
    setDefaults(fields: Record<keyof TForm, string>): void
    reset: (...fields: (keyof TForm)[]) => void
    clearErrors: (...fields: (keyof TForm)[]) => void
    setError(field: keyof TForm, value: string): void
    setError(errors: Record<keyof TForm, string>): void
    submit: (method: Method, url: string, options?: VisitOptions) => void
    get: (url: string, options?: VisitOptions) => void
    patch: (url: string, options?: VisitOptions) => void
    post: (url: string, options?: VisitOptions) => void
    put: (url: string, options?: VisitOptions) => void
    delete: (url: string, options?: VisitOptions) => void
}
export default function useForm<TForm extends Record<string, unknown>>(initialValues?: TForm): UseFormProps<TForm>

export default function useForm<TForm extends Record<string, unknown>>(
    initialValues?: TForm,
): UseFormProps<TForm>


export default function useForm<TForm extends Record<string, unknown>>(maybeInitialValues?: TForm): UseFormProps<TForm> {

    const isMounted = useRef<boolean>(false);
    const recentlySuccessfulTimeoutId = useRef<NodeJS.Timeout | undefined>(undefined);
    const transform = useRef<((toTransform: TForm) => TForm) | undefined>(undefined);

    const [defaults, setDefaults] = useState<TForm>(maybeInitialValues || ({} as TForm));
    const [data, setData] = useState<TForm>(defaults);
    const [errors, setErrors] = useState<Partial<Record<keyof TForm, string>>>({} as Partial<Record<keyof TForm, string>>);
    const [hasErrors, setHasErrors] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [wasSuccessful, setWasSuccessful] = useState<boolean>(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState<boolean>(false);

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])

    const submit = useCallback(
        (method: Method, url: string, options: VisitOptions = {}) => {

            const _options = {

                method: method,
                body: JSON.stringify(transform.current ? transform.current(data) : data),
                ...options,

                onSuccess: (res: Response) => {
                    if (isMounted.current) {
                        setProcessing(false)
                        setErrors({})
                        setHasErrors(false)
                        setWasSuccessful(true)
                        setRecentlySuccessful(true)

                        recentlySuccessfulTimeoutId.current = setTimeout(() => {
                            if (isMounted.current) {
                                setRecentlySuccessful(false)
                            }
                        }, 2000)
                    }

                    if (options.onSuccess) {
                        return options.onSuccess(res)
                    }
                },

                onError: (errors: Partial<Record<keyof TForm, string>>) => {
                    if (isMounted.current) {
                        setProcessing(false)
                        setErrors(errors)
                        setHasErrors(true)
                    }

                    if (options.onError) {
                        return options.onError(errors as Errors)
                    }
                },

                onFinish: () => {
                    if (isMounted.current) {
                        setProcessing(false)

                    }

                    transform.current = undefined;

                    if (options.onFinish) {
                        return options.onFinish()
                    }
                },
            };

            setProcessing(true);

            // Perfomr the request
            fetch(url, _options)
                .then(async (response: Response) => {

                    if (!response.ok) {
                        const resData = await response.json();
                        _options.onError(resData?.errors);
                        return;
                    }

                    _options.onSuccess(response);
                })
                .catch((error) => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    _options.onFinish();
                });
        },
        [data, setErrors],
    )

    return {
        data,
        setData(keyOrData: keyof TForm | Function | TForm, maybeValue?: TForm[keyof TForm]) {
            if (typeof keyOrData === 'string') {
                setData({ ...data, [keyOrData]: maybeValue })
            } else if (typeof keyOrData === 'function') {
                setData((data) => keyOrData(data))
            } else {
                setData(keyOrData as TForm)
            }
        },
        errors,
        hasErrors,
        processing,
        setProcessing,
        wasSuccessful,
        recentlySuccessful,
        transform(callback: (data: TForm) => TForm) {
            transform.current = callback;
        },
        setDefaults(fieldOrFields?: keyof TForm | Record<keyof TForm, string>, maybeValue?: string) {
            if (typeof fieldOrFields === 'undefined') {
                setDefaults(() => data)
            } else {
                setDefaults((defaults) => ({
                    ...defaults,
                    ...(typeof fieldOrFields === 'string' ? { [fieldOrFields]: maybeValue } : (fieldOrFields as TForm)),
                }))
            }
        },
        reset(...fields) {
            if (fields.length === 0) {
                setData(defaults)
            } else {
                setData(
                    (Object.keys(defaults) as Array<keyof TForm>)
                        .filter((key) => fields.includes(key))
                        .reduce(
                            (carry, key) => {
                                carry[key] = defaults[key]
                                return carry
                            },
                            { ...data },
                        ),
                )
            }
        },
        setError(fieldOrFields: keyof TForm | Record<keyof TForm, string>, maybeValue?: string) {
            setErrors((errors) => {
                const newErrors = {
                    ...errors,
                    ...(typeof fieldOrFields === 'string'
                        ? { [fieldOrFields]: maybeValue }
                        : (fieldOrFields as Record<keyof TForm, string>)),
                }
                setHasErrors(Object.keys(newErrors).length > 0)
                return newErrors
            })
        },
        clearErrors(...fields) {
            setErrors((errors) => {
                const newErrors = (Object.keys(errors) as Array<keyof TForm>).reduce(
                    (carry, field) => ({
                        ...carry,
                        ...(fields.length > 0 && !fields.includes(field) ? { [field]: errors[field] } : {}),
                    }),
                    {},
                )
                setHasErrors(Object.keys(newErrors).length > 0)
                return newErrors
            })
        },
        submit,
        get(url: string, options) { submit('GET', url, options) },
        post(url: string, options) { submit('POST', url, options) },
        put(url: string, options) { submit('PUT', url, options) },
        patch(url: string, options) { submit('PATCH', url, options) },
        delete(url: string, options) { submit('DELETE', url, options) }
    }
}