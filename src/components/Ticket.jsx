import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import QRCode from "qrcode";

import { formatDateTime } from "../util/helperfunctions";

// Register fonts
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf_viewer.css",
    },
    {
      src: "https://fonts.cdnfonts.com/s/9461/helvetica-neue-bold.woff",
      fontWeight: "bold",
    },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 10,
  },
  ticketRow: {
    flexDirection: "row",
    fontSize: 12,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    borderBottomStyle: "dashed",
    marginBottom: 20,
    paddingBottom: 10,
  },
  qrSection: {
    margin: 10,
    flexGrow: 1,
  },
  detailsSection: {
    marginTop: 30,
    flexGrow: 2,
    paddingHorizontal: 10,
  },
  ticketDetails: {
    flexDirection: "row",
    marginBottom: 5,
  },
  leftColumn: {
    width: 100, // Fixed width for alignment
    fontWeight: "bold",
    fontSize: 12,
  },
  rightColumn: {
    flexGrow: 1, // Take remaining space
    fontSize: 12,
  },
  bottomRow: {
    marginTop: 20,
    paddingTop: 10,
    fontSize: 10,
    textAlign: "center",
    alignItems: "center",
  },
  bottomParagraph: {
    marginLeft: 10,
    marginBottom: 20,
  },
  bottomTitle: {
    fontSize: 14,
    color: "#0303F1",
    fontWeight: "bold",
    marginBottom: 20,
  },
  qrCode: {
    width: 128,
    height: 128,
    marginBottom: 10,
  },
});

// Generate QR code function
const generateQRCode = async (text) => {
  try {
    return await QRCode.toDataURL(text, { errorCorrectionLevel: "Q" });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
};

const Ticket = ({ tickets }) => {
  const [preparedTickets, setPreparedTickets] = useState(null);

  useEffect(() => {
    const prepareTickets = async () => {
      if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
        console.error("Invalid tickets data");
        return;
      }

      // Generate QR codes for all tickets
      const updatedTickets = await Promise.all(
        tickets.map(async (ticket) => {
          if (!ticket.barcode) {
            console.error("Invalid ticket: Missing barcode", ticket);
            return null;
          }
          const qrCode = await generateQRCode(ticket.barcode);
          return { ...ticket, qrCode };
        })
      );

      // Filter out invalid tickets
      const validTickets = updatedTickets.filter(
        (ticket) => ticket && ticket.qrCode
      );
      setPreparedTickets(validTickets);
    };

    prepareTickets();
  }, [tickets]);

  if (!preparedTickets) {
    return <p className="text-center">Loading tickets...</p>;
  }

  return (
    <Document>
      {preparedTickets.map((ticket, index) => (
        <Page key={index} size="A4" style={styles.page}>
          {/* Ticket Top Row */}
          <View style={styles.ticketRow}>
            {/* QR Code Section */}
            <View style={styles.qrSection}>
              {ticket.qrCode && (
                <Image style={styles.qrCode} src={ticket.qrCode} />
              )}
            </View>

            {/* Ticket Details Section */}
            <View style={styles.detailsSection}>
              <View style={styles.ticketDetails}>
                <Text style={styles.leftColumn}>Event:</Text>
                <Text style={styles.rightColumn}>
                  {ticket.event?.name || "Unknown Event"}
                </Text>
              </View>
              <View style={styles.ticketDetails}>
                <Text style={styles.leftColumn}>Ticket Type:</Text>
                <Text style={styles.rightColumn}>
                  {ticket.ticketType?.name || "Unknown Ticket Type"}
                </Text>
              </View>
              <View style={styles.ticketDetails}>
                <Text style={styles.leftColumn}>Venue:</Text>
                <Text style={styles.rightColumn}>
                  {ticket.venue?.name || "Unknown Venue"}
                </Text>
              </View>
              <View style={styles.ticketDetails}>
                <Text style={styles.leftColumn}>Price:</Text>
                <Text style={styles.rightColumn}>
                  {ticket.price?.toFixed(2) || "0.00"} €
                </Text>
              </View>
              <View style={styles.ticketDetails}>
                <Text style={styles.leftColumn}>Time:</Text>
                <Text style={styles.rightColumn}>
                  {formatDateTime(ticket.event?.beginsAt || new Date())}
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Row */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomTitle}>Ticket #{index + 1}</Text>
            <Text style={styles.bottomParagraph}>
              Terms and Conditions: The ticket is non-refundable. For further
              information, visit ticketguru.store.
            </Text>
            <Text style={styles.bottomParagraph}>Event Details: </Text>
            <Text style={styles.bottomParagraph}>
              Venue: {ticket.venue?.name || "Unknown Venue"}
            </Text>
            <Text style={styles.bottomParagraph}>
              Event: {ticket.event?.name || "Unknown Event"}
            </Text>
            <Text style={styles.bottomParagraph}>
              Time:{" "}
              {new Date(ticket.event?.beginsAt || new Date())
                .toLocaleDateString("fi-FI", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .replace(",", "")}
            </Text>
            <Text style={styles.bottomParagraph}>
              Ticket Type: {ticket.ticketType?.name || "Unknown Ticket Type"}
            </Text>
            <Text style={styles.bottomParagraph}>
              Price: {ticket.price?.toFixed(2) || "0.00"} €
            </Text>
            <Text style={styles.bottomParagraph}>
              {ticket.event?.description || "No description available"}
            </Text>
            <Text style={styles.bottomParagraph}>
              Ticket Number: {ticket.barcode}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default Ticket;
