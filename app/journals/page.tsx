"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function JournalsPage() {
  const [selectedJournal, setSelectedJournal] = useState("all")

  const journals = [
    {
      id: "lancet",
      name: "The Lancet",
      description: "The world's leading independent medical journal",
      impact: "68.3",
      issues: "52 per year",
      image: "/the-lancet.jpg",
    },
    {
      id: "oncology",
      name: "The Lancet Oncology",
      description: "Leading journal for cancer research and treatment",
      impact: "52.1",
      issues: "12 per year",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "neurology",
      name: "The Lancet Neurology",
      description: "Premier journal for neurology and neuroscience",
      impact: "45.8",
      issues: "12 per year",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "psychiatry",
      name: "The Lancet Psychiatry",
      description: "Leading journal for mental health research",
      impact: "38.2",
      issues: "12 per year",
      image: "/placeholder.svg?height=150&width=150",
    },
  ]

  return (
    <>
      <Header />
      <div className="py-5">
        <div className="container">
          <h1 className="mb-4">Our Journals</h1>

          <div className="row mb-4">
            <div className="col-12">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${selectedJournal === "all" ? "btn-lancet" : "btn-lancet-outline"}`}
                  onClick={() => setSelectedJournal("all")}
                >
                  All Journals
                </button>
                {journals.map((journal) => (
                  <button
                    key={journal.id}
                    type="button"
                    className={`btn ${selectedJournal === journal.id ? "btn-lancet" : "btn-lancet-outline"}`}
                    onClick={() => setSelectedJournal(journal.id)}
                  >
                    {journal.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="row">
            {journals.map((journal) => (
              <div key={journal.id} className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src={journal.image || "/placeholder.svg"}
                        alt={journal.name}
                        className="rounded"
                        style={{ width: "100px", height: "100px" }}
                      />
                      <div>
                        <h5 className="card-title">{journal.name}</h5>
                        <p className="card-text text-muted">{journal.description}</p>
                      </div>
                    </div>
                    <div className="row text-center mb-3">
                      <div className="col-6">
                        <small className="text-muted">Impact Factor</small>
                        <p className="fw-bold">{journal.impact}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Publication</small>
                        <p className="fw-bold">{journal.issues}</p>
                      </div>
                    </div>
                    <button className="btn btn-lancet w-100">Browse Journal</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
