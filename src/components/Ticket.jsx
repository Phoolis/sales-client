import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import QRCode from "qrcode";

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  qrCode: {
    width: 128,
    height: 128,
    marginBottom: 20,
  },
  loadingText: {
    margin: 20,
    fontSize: 18,
    textAlign: "center",
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
    // Display loading message
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.loadingText}>Loading tickets...</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {preparedTickets.map((ticket, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.section}>
            {ticket.qrCode && (
              <Image style={styles.qrCode} src={ticket.qrCode} />
            )}
            <Text>{ticket.event?.name || "Unknown Event"}</Text>
            <Text>{ticket.ticketType?.name || "Unknown Ticket Type"}</Text>
            <Text>{ticket.venue?.name || "Unknown Venue"}</Text>
            <Text>{ticket.price?.toFixed(2) || "0.00"}</Text>
            <Text>{ticket.barcode || "No Barcode"}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default Ticket;
