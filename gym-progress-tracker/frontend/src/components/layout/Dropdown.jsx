import { Popover } from '@headlessui/react'
import { Link } from "react-router"
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'

const Dropdown = ({dropdown_title, dropdown_items}) => {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button className="inline-flex items-center gap-x-1 text-m font-semibold text-white-900 focus:outline-none">
                        <span>{dropdown_title}</span>
                        <motion.div
                            animate={{ rotate: open ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDownIcon aria-hidden="true" className="size-5" />
                        </motion.div>
                    </Popover.Button>

                    <Popover.Panel>
                        {({ close }) => (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4"
                            >
                                <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 shadow-lg ring-gray-900/5"
                                >
                                    <div className="p-4">
                                        {dropdown_items.map((item, index) => (
                                            <motion.div
                                                key={item.name}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                                className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
                                                onClick={() => close()}
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white"
                                                >
                                                    <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                                                </motion.div>
                                                <div>
                                                    <Link to={item.href} className="font-semibold text-gray-900">
                                                        {item.name}
                                                        <span className="absolute inset-0" />
                                                    </Link>
                                                    <p className="mt-1 text-gray-600">{item.description}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </Popover.Panel>
                </>
            )}
        </Popover>
    )
}

export default Dropdown