/**
 * useDocumentHandlers Hook
 *
 * Manages document CRUD operations and state updates for document components.
 */

import { useCallback } from "react";
import type { DocumentItem } from "../DocumentComponent.types";

export interface UseDocumentHandlersOptions {
  /** Current documents array */
  documents: DocumentItem[];
  /** Function to update documents */
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  /** Set of expanded document IDs */
  expandedDocuments: Set<string>;
  /** Function to update expanded documents */
  setExpandedDocuments: React.Dispatch<React.SetStateAction<Set<string>>>;
  /** External callback for document click */
  onDocumentClick?: (documentId: string) => void;
  /** External callback for section toggle */
  onSectionToggle?: (
    documentId: string,
    sectionId: string,
    checked: boolean
  ) => void;
  /** External callback for section content change */
  onSectionContentChange?: (
    documentId: string,
    sectionId: string,
    content: string
  ) => void;
  /** External callback for document check toggle */
  onDocumentCheckToggle?: (documentId: string, checked: boolean) => void;
  /** Refs to document elements for scrolling */
  documentRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
}

export interface UseDocumentHandlersReturn {
  /** Handle document card click to expand/collapse */
  handleDocumentClick: (documentId: string, shouldToggle?: boolean) => void;
  /** Handle section checkbox toggle */
  handleSectionToggle: (
    documentId: string,
    sectionId: string,
    checked: boolean
  ) => void;
  /** Handle section content text change */
  handleSectionContentChange: (
    documentId: string,
    sectionId: string,
    content: string
  ) => void;
  /** Handle document-level checkbox toggle (affects all sections) */
  handleDocumentCheckToggle: (documentId: string, checked: boolean) => void;
  /** Check if all sections in a document are checked */
  areAllSectionsChecked: (document: DocumentItem) => boolean;
  /** Check if some (but not all) sections in a document are checked */
  areSomeSectionsChecked: (document: DocumentItem) => boolean;
  /** Register a document ref for scrolling */
  registerDocumentRef: (
    documentId: string,
    element: HTMLDivElement | null
  ) => void;
}

export const useDocumentHandlers = (
  options: UseDocumentHandlersOptions
): UseDocumentHandlersReturn => {
  const {
    setDocuments,
    expandedDocuments,
    setExpandedDocuments,
    onDocumentClick: externalOnDocumentClick,
    onSectionToggle: externalOnSectionToggle,
    onSectionContentChange: externalOnSectionContentChange,
    onDocumentCheckToggle: externalOnDocumentCheckToggle,
    documentRefs,
  } = options;

  const handleDocumentClick = useCallback(
    (documentId: string, shouldToggle: boolean = false) => {
      const newExpanded = new Set(expandedDocuments);
      if (shouldToggle) {
        // Toggle behavior for accordion header clicks
        if (newExpanded.has(documentId)) {
          newExpanded.delete(documentId);
        } else {
          newExpanded.add(documentId);
        }
      } else {
        // Always open for index/recent links
        newExpanded.add(documentId);
      }
      setExpandedDocuments(newExpanded);
      externalOnDocumentClick?.(documentId);

      // Smooth scroll to the document card in the stack
      setTimeout(() => {
        const documentElement = documentRefs.current[documentId];
        if (documentElement) {
          documentElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100); // Small delay to ensure expansion animation starts
    },
    [
      expandedDocuments,
      setExpandedDocuments,
      externalOnDocumentClick,
      documentRefs,
    ]
  );

  const handleSectionToggle = useCallback(
    (documentId: string, sectionId: string, checked: boolean) => {
      // Update local state
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) => {
          if (doc.id === documentId) {
            return {
              ...doc,
              sections:
                doc.sections?.map((section) =>
                  section.id === sectionId ? { ...section, checked } : section
                ) || [],
            };
          }
          return doc;
        })
      );

      // Call external callback
      externalOnSectionToggle?.(documentId, sectionId, checked);
    },
    [setDocuments, externalOnSectionToggle]
  );

  const handleSectionContentChange = useCallback(
    (documentId: string, sectionId: string, content: string) => {
      // Update local state
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) => {
          if (doc.id === documentId) {
            return {
              ...doc,
              sections:
                doc.sections?.map((section) =>
                  section.id === sectionId ? { ...section, content } : section
                ) || [],
            };
          }
          return doc;
        })
      );

      // Call external callback
      externalOnSectionContentChange?.(documentId, sectionId, content);
    },
    [setDocuments, externalOnSectionContentChange]
  );

  const handleDocumentCheckToggle = useCallback(
    (documentId: string, checked: boolean) => {
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) => {
          if (doc.id === documentId && doc.sections) {
            return {
              ...doc,
              sections: doc.sections.map((section) => ({
                ...section,
                checked,
              })),
            };
          }
          return doc;
        })
      );

      externalOnDocumentCheckToggle?.(documentId, checked);
    },
    [setDocuments, externalOnDocumentCheckToggle]
  );

  const areAllSectionsChecked = useCallback(
    (document: DocumentItem): boolean => {
      if (!document.sections || document.sections.length === 0) return false;
      return document.sections.every((section) => section.checked);
    },
    []
  );

  const areSomeSectionsChecked = useCallback(
    (document: DocumentItem): boolean => {
      if (!document.sections || document.sections.length === 0) return false;
      return document.sections.some((section) => section.checked);
    },
    []
  );

  const registerDocumentRef = useCallback(
    (documentId: string, element: HTMLDivElement | null) => {
      documentRefs.current[documentId] = element;
    },
    [documentRefs]
  );

  return {
    handleDocumentClick,
    handleSectionToggle,
    handleSectionContentChange,
    handleDocumentCheckToggle,
    areAllSectionsChecked,
    areSomeSectionsChecked,
    registerDocumentRef,
  };
};
