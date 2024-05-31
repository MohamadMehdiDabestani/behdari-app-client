'use client'
import { loading } from '@/atom'
import {Loading} from '@/components'
import { useAtom } from 'jotai'
import { Fragment } from 'react'

export const ClientLoading = () => {
    const [isLoading, _] = useAtom(loading)
    return isLoading ? <Loading  /> : <Fragment></Fragment>
}