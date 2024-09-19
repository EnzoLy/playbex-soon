'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image'
import logo from '@/assets/images/logo.png'

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [ign, setIgn] = useState('')
  const [visible, setVisible] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setVisible(true)
  }, [])

  const handleButtonClick = () => {
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (ign.trim()) {
      fetch('/api/save-ign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ign }),
      }).then(async data => {

        const res = await data.json();

        if (data.ok) {
          setIsDialogOpen(false)
          setIgn('')
          toast({
            title: "IGN Saved",
            description: `Your Minecraft IGN "${ign}" has been saved successfully.`,
          })
        } else {
          setIsDialogOpen(false)
          toast({
            title: "Error",
            description: res.error || "An error occurred while saving your IGN.",
          });
        }
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 to-indigo-600">
      <div className="mb-8 animate-breath">
        <Image
          src={logo}
          alt="Playbex Logo"
          width={200}
          height={200}
          className="rounded-full"
        />
      </div>
      <h1 className="text-5xl font-bold mb-4 text-white">Playbex</h1>
      <p className={`text-2xl mb-8 text-teal-200 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
        Coming Soon
      </p>
      <Button
        size="lg"
        className="text-lg px-6 py-3 bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors duration-300"
        onClick={handleButtonClick}
      >
        Confirmar participación
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent style={{ backgroundColor: '#000000' }} className="text-white">
          <DialogHeader>
            <DialogTitle>Enter Your Minecraft IGN</DialogTitle>
            <DialogDescription>
              Please provide your Minecraft In-Game Name (IGN) to confirm your participation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Your Minecraft IGN"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              className="mb-4"
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
