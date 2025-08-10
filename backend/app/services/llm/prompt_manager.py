import yaml
import os
from typing import Dict, Any, Optional
from pathlib import Path
from app.utils.file_locator import ROOT_DIR
import logging

logger = logging.getLogger(__name__)


def load_prompts():
    """Simplified mechanism to load prompts into memory."""
    prompts = {}
    PROMPT_DIR = ROOT_DIR / "prompts"
    
    for yaml_file in PROMPT_DIR.glob("*.yaml"):
        try:
            with open(yaml_file, 'r', encoding='utf-8') as f:
                content = yaml.safe_load(f)
                category = yaml_file.stem
                prompts[category] = content
                logger.info(f"Loaded prompts from {yaml_file.name}")
        except Exception as e:
            logger.error(f"Error loading {yaml_file.name}: {e}")
    
    return prompts

class PromptManager:
    """Manages prompt templates loaded from YAML files"""
    
    _prompts: Dict[str, Any] = {}
    _initialized: bool = False

    @classmethod
    async def initialize(cls):
        """Load all prompt templates from YAML files into memory"""
        if cls._initialized:
            return
            
        prompts_dir = ROOT_DIR / "prompts"
        if not prompts_dir.exists():
            logger.warning("Prompts directory not found!")
            return
            
        for yaml_file in prompts_dir.glob("*.yaml"):
            try:
                with open(yaml_file, 'r', encoding='utf-8') as f:
                    content = yaml.safe_load(f)
                    category = yaml_file.stem
                    cls._prompts[category] = content
                    logger.info(f"Loaded prompts from {yaml_file.name}")
            except Exception as e:
                logger.error(f"Error loading {yaml_file.name}: {e}")
        
        cls._initialized = True
        logger.info(f"Prompt Manager initialized with {len(cls._prompts)} categories")
    
    @classmethod
    def get_prompt(cls, category: str, prompt_name: str, **kwargs) -> str:
        """Get a formatted prompt template"""
        if not cls._initialized:
            raise RuntimeError("PromptManager not initialized. Call initialize() first.")
            
        if category not in cls._prompts:
            raise ValueError(f"Prompt category '{category}' not found")
            
        if prompt_name not in cls._prompts[category]:
            raise ValueError(f"Prompt '{prompt_name}' not found in category '{category}'")
        
        template = cls._prompts[category][prompt_name]
        
        # Handle nested prompt structure
        if isinstance(template, dict):
            if 'template' in template:
                template = template['template']
            else:
                raise ValueError(f"Invalid prompt structure for '{prompt_name}'")
        
        # Format template with provided kwargs
        try:
            return template.format(**kwargs)
        except KeyError as e:
            raise ValueError(f"Missing template variable: {e}")
    
    @classmethod
    def get_system_message(cls, category: str, prompt_name: str) -> str:
        """Get system message for a prompt"""
        if category not in cls._prompts:
            return ""
            
        prompt_config = cls._prompts[category].get(prompt_name, {})
        if isinstance(prompt_config, dict):
            return prompt_config.get('system_message', '')
        return ""
    
    @classmethod
    def get_prompt_config(cls, category: str, prompt_name: str) -> Dict[str, Any]:
        """Get full prompt configuration including metadata"""
        if category not in cls._prompts:
            return {}
            
        return cls._prompts[category].get(prompt_name, {})
    
    @classmethod
    def list_categories(cls) -> list[str]:
        """List all available prompt categories"""
        return list(cls._prompts.keys())
    
    @classmethod
    def list_prompts(cls, category: str) -> list[str]:
        """List all prompts in a category"""
        if category not in cls._prompts:
            return []
        return list(cls._prompts[category].keys())