import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        people: resolve(__dirname, 'people.html'),
        vehicle: resolve(__dirname, 'vehicle.html'),
        addVehicle: resolve(__dirname, 'add-vehicle.html'),
      },
    },
  },
})
