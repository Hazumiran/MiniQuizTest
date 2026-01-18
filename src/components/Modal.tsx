/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Dialog, DialogPanel, DialogTitle,Transition, TransitionChild} from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

interface ModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  title: string
  description: string
  primaryAction: {
    label: string
    onClick: () => void
    color?: 'red' | 'blue' | 'green' | 'yellow'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  icon?: any
}

const colorMap = {
  red: 'bg-red-600 hover:bg-red-500 text-white',
  blue: 'bg-blue-600 hover:bg-blue-500 text-white',
  green: 'bg-green-600 hover:bg-green-500 text-white',
  yellow: 'bg-yellow-600 hover:bg-yellow-500 text-white',
}

const Modal: React.FC<ModalProps> = ({
  open,
  setOpen,
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>        
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-start">
                  <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    {icon || <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{description}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto ${colorMap[primaryAction.color || 'red']}`}
                >
                  {primaryAction.label}
                </button>

                {secondaryAction && (
                  <button
                    type="button"
                    onClick={secondaryAction.onClick}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
