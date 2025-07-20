import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Maximize2, 
  Minimize2,
  RotateCw,
  Search,
  MessageCircle,
  FileText
} from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string;
  contractId: number;
  onLineSelect?: (lineNumber: number) => void;
  className?: string;
}

export default function PDFViewer({ 
  pdfUrl, 
  contractId, 
  onLineSelect,
  className = "" 
}: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PDF.js would be integrated here in a real implementation
  // For now, we'll create a mock PDF viewer that demonstrates the functionality

  useEffect(() => {
    // Simulate PDF loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pdfUrl]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);
    onLineSelect?.(lineNumber);
  };

  const handleDownload = () => {
    // In a real implementation, this would trigger PDF download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `contract-${contractId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navyblue mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF document...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Failed to load PDF document</p>
              <p className="text-sm text-gray-500">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock PDF content - in a real implementation, this would be rendered by PDF.js
  const mockPdfLines = [
    "CONTRACT AGREEMENT",
    "",
    "This Agreement is entered into on [DATE] between HLSG Industries",
    "and the Client as specified in the contract details.",
    "",
    "1. SCOPE OF WORK",
    "The Contractor agrees to provide the following services:",
    "- Strategic business consulting",
    "- Technology implementation support", 
    "- Project management and oversight",
    "",
    "2. TERMS AND CONDITIONS",
    "Payment terms: Net 30 days from invoice date",
    "Project duration: As specified in the project timeline",
    "Deliverables: As outlined in Appendix A",
    "",
    "3. RESPONSIBILITIES",
    "Client responsibilities include:",
    "- Providing necessary access and information",
    "- Timely feedback on deliverables",
    "- Payment according to agreed schedule",
    "",
    "Contractor responsibilities include:",
    "- Professional service delivery",
    "- Meeting agreed timelines",
    "- Quality assurance and testing",
    "",
    "4. INTELLECTUAL PROPERTY",
    "All intellectual property developed during this project",
    "shall remain the property of HLSG Industries unless",
    "otherwise specified in writing.",
    "",
    "5. CONFIDENTIALITY",
    "Both parties agree to maintain confidentiality of",
    "proprietary information shared during this engagement.",
    "",
    "6. TERMINATION",
    "This agreement may be terminated by either party with",
    "30 days written notice.",
    "",
    "IN WITNESS WHEREOF, the parties have executed this",
    "Agreement as of the date first written above.",
    "",
    "HLSG INDUSTRIES                CLIENT",
    "",
    "_________________            _________________",
    "Authorized Signature         Authorized Signature",
    "",
    "Date: _______________        Date: _______________"
  ];

  return (
    <div className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <Card className={isFullscreen ? 'h-full border-0 rounded-none' : ''}>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-navyblue">
              <FileText className="mr-2 h-5 w-5" />
              Contract Document
              {selectedLine !== null && (
                <Badge variant="outline" className="ml-2">
                  Line {selectedLine} selected
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 border rounded-lg px-2 py-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleZoomOut}
                  disabled={zoom <= 25}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2">{zoom}%</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleZoomIn}
                  disabled={zoom >= 300}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <Button size="sm" variant="outline" onClick={handleRotate}>
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button size="sm" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
              
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              
              <Button size="sm" variant="outline" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={`p-0 ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'max-h-[600px]'} overflow-auto`}>
          <div 
            className="bg-white border-2 border-gray-200 mx-4 my-4 shadow-lg"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top left',
              width: `${100 / (zoom / 100)}%`,
              minHeight: '800px'
            }}
          >
            <div className="p-8 font-mono text-sm leading-relaxed">
              {mockPdfLines.map((line, index) => (
                <div
                  key={index}
                  className={`
                    cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors
                    ${selectedLine === index + 1 ? 'bg-blue-100 border-l-4 border-blue-500' : ''}
                    ${line.trim() === '' ? 'h-4' : ''}
                  `}
                  onClick={() => line.trim() !== '' && handleLineClick(index + 1)}
                  title={line.trim() !== '' ? `Click to comment on line ${index + 1}` : ''}
                >
                  {line.trim() !== '' && (
                    <span className="inline-flex items-center">
                      <span className="text-gray-400 text-xs mr-3 w-8 text-right">
                        {index + 1}
                      </span>
                      <span className={`
                        ${line.includes('CONTRACT AGREEMENT') ? 'text-xl font-bold text-center block' : ''}
                        ${line.match(/^\d+\./) ? 'font-semibold text-navyblue' : ''}
                        ${line.includes('HLSG INDUSTRIES') || line.includes('CLIENT') ? 'font-semibold' : ''}
                      `}>
                        {line}
                      </span>
                      {selectedLine === index + 1 && (
                        <MessageCircle className="h-4 w-4 text-blue-500 ml-2" />
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Page navigation would go here in a real PDF viewer */}
          <div className="flex items-center justify-center py-4 border-t bg-gray-50">
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="outline" disabled>
                Previous Page
              </Button>
              <span className="text-sm text-gray-600">Page 1 of 1</span>
              <Button size="sm" variant="outline" disabled>
                Next Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
